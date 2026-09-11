import { and, asc, eq, gt } from "drizzle-orm";

import { db } from "@/db";
import {
  executionEventsTable,
  executionsTable,
  workflowsTable,
} from "@/db/schema";

import { requireApiKey } from "@/features/api-keys/api-key-auth";

const TERMINAL_EVENTS = new Set(["execution.completed", "execution.failed"]);

const TERMINAL_STATUSES = new Set(["success", "error", "cancelled"]);

const POLL_INTERVAL_MS = 500;

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      executionId: string;
    }>;
  },
) {
  try {
    const { executionId } = await params;

    const apiKey = await requireApiKey(request);

    /*
     * Verify that the execution belongs to a workflow
     * inside the project associated with the API key.
     */
    const [execution] = await db
      .select({
        id: executionsTable.id,
        workflowId: executionsTable.workflowId,
        status: executionsTable.status,
      })
      .from(executionsTable)
      .innerJoin(
        workflowsTable,
        eq(executionsTable.workflowId, workflowsTable.id),
      )
      .where(
        and(
          eq(executionsTable.id, executionId),
          eq(workflowsTable.projectId, apiKey.projectId),
        ),
      )
      .limit(1);

    if (!execution) {
      return Response.json(
        {
          error: "Execution not found",
        },
        {
          status: 404,
        },
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let closed = false;
        let polling = false;

        let pollTimeout: ReturnType<typeof setTimeout> | undefined;

        /*
         * Track every event that has already been sent
         * through this SSE connection.
         *
         * This prevents the exact same event from being
         * emitted multiple times.
         */
        const sentEventIds = new Set<string>();

        /*
         * Cursor for polling.
         */
        let lastCreatedAt: Date | null = null;

        const close = () => {
          if (closed) {
            return;
          }

          closed = true;

          if (pollTimeout) {
            clearTimeout(pollTimeout);
            pollTimeout = undefined;
          }

          try {
            controller.close();
          } catch {
            // Stream may already be closed.
          }
        };

        const sendEvent = (event: typeof executionEventsTable.$inferSelect) => {
          if (closed) {
            return false;
          }

          /*
           * IMPORTANT:
           *
           * Never send the same database event twice
           * during this connection.
           */
          if (sentEventIds.has(event.id)) {
            return false;
          }

          sentEventIds.add(event.id);

          const payload = {
            id: event.id,
            executionId: event.executionId,
            workflowId: event.workflowId,
            type: event.type,
            timestamp: event.createdAt,
            data: event.data,
          };

          controller.enqueue(
            encoder.encode(
              `id: ${event.id}\n` +
                `event: ${event.type}\n` +
                `data: ${JSON.stringify(payload)}\n\n`,
            ),
          );

          lastCreatedAt = event.createdAt;

          return true;
        };

        const getEvents = async () => {
          /*
           * First poll:
           *
           * Fetch all events for this execution.
           */
          if (!lastCreatedAt) {
            return db
              .select()
              .from(executionEventsTable)
              .where(eq(executionEventsTable.executionId, executionId))
              .orderBy(
                asc(executionEventsTable.createdAt),
                asc(executionEventsTable.id),
              );
          }

          /*
           * Subsequent polls:
           *
           * Only fetch events created after the
           * latest event we've processed.
           */
          return db
            .select()
            .from(executionEventsTable)
            .where(
              and(
                eq(executionEventsTable.executionId, executionId),
                gt(executionEventsTable.createdAt, lastCreatedAt),
              ),
            )
            .orderBy(
              asc(executionEventsTable.createdAt),
              asc(executionEventsTable.id),
            );
        };

        const processEvents = async () => {
          if (closed) {
            return;
          }

          /*
           * Prevent overlapping database polls.
           */
          if (polling) {
            return;
          }

          polling = true;

          try {
            const events = await getEvents();

            for (const event of events) {
              if (closed) {
                return;
              }

              sendEvent(event);

              /*
               * Stop immediately when execution finishes.
               */
              if (TERMINAL_EVENTS.has(event.type)) {
                close();
                return;
              }
            }
          } catch (error) {
            console.error("Failed to poll execution events:", error);

            close();
            return;
          } finally {
            polling = false;
          }

          /*
           * Schedule the next poll only after the
           * current poll has completely finished.
           */
          if (!closed) {
            pollTimeout = setTimeout(processEvents, POLL_INTERVAL_MS);
          }
        };

        try {
          /*
           * ---------------------------------------------------------
           * 1. Send events that already exist.
           * ---------------------------------------------------------
           */

          const existingEvents = await getEvents();

          for (const event of existingEvents) {
            if (closed) {
              return;
            }

            sendEvent(event);

            /*
             * If the execution has already finished,
             * there is nothing else to stream.
             */
            if (TERMINAL_EVENTS.has(event.type)) {
              close();
              return;
            }
          }

          /*
           * ---------------------------------------------------------
           * 2. Execution may already be terminal.
           * ---------------------------------------------------------
           *
           * This protects us if the execution finished but
           * the terminal event wasn't persisted for some reason.
           */
          if (TERMINAL_STATUSES.has(execution.status)) {
            close();
            return;
          }

          /*
           * ---------------------------------------------------------
           * 3. Start polling.
           * ---------------------------------------------------------
           */
          pollTimeout = setTimeout(processEvents, POLL_INTERVAL_MS);

          /*
           * ---------------------------------------------------------
           * 4. Handle client disconnect.
           * ---------------------------------------------------------
           */
          request.signal.addEventListener("abort", close, {
            once: true,
          });
        } catch (error) {
          console.error("Failed to initialize execution event stream:", error);

          close();
        }
      },

      cancel() {
        /*
         * The request abort handler handles cleanup.
         */
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",

        "Cache-Control": "no-cache, no-transform",

        Connection: "keep-alive",

        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Failed to create execution event stream:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create event stream",
      },
      {
        status: 500,
      },
    );
  }
}
