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
  { params }: { params: Promise<{ executionId: string }> },
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
        let interval: ReturnType<typeof setInterval> | undefined;
        let lastCreatedAt: Date | null = null;

        const close = () => {
          if (closed) {
            return;
          }

          closed = true;

          if (interval) {
            clearInterval(interval);
            interval = undefined;
          }

          try {
            controller.close();
          } catch {
            // Stream may already be closed by the runtime.
          }
        };

        const sendEvent = (event: typeof executionEventsTable.$inferSelect) => {
          if (closed) {
            return;
          }

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
        };

        try {
          /*
           * ---------------------------------------------------------
           * 1. Send events that already exist.
           * ---------------------------------------------------------
           */
          const existingEvents = await db
            .select()
            .from(executionEventsTable)
            .where(eq(executionEventsTable.executionId, executionId))
            .orderBy(asc(executionEventsTable.createdAt));

          for (const event of existingEvents) {
            sendEvent(event);

            /*
             * If we already reached a terminal event, there is
             * nothing left to stream.
             */
            if (TERMINAL_EVENTS.has(event.type)) {
              close();
              return;
            }
          }

          /*
           * ---------------------------------------------------------
           * 2. If execution is already terminal, close.
           * ---------------------------------------------------------
           *
           * This protects us if the execution finished but for some
           * reason the terminal event was not persisted.
           */
          if (TERMINAL_STATUSES.has(execution.status)) {
            close();
            return;
          }

          /*
           * ---------------------------------------------------------
           * 3. Poll for newly persisted events.
           * ---------------------------------------------------------
           */
          interval = setInterval(async () => {
            if (closed) {
              return;
            }

            try {
              let newEvents;

              if (lastCreatedAt) {
                newEvents = await db
                  .select()
                  .from(executionEventsTable)
                  .where(
                    and(
                      eq(executionEventsTable.executionId, executionId),
                      gt(executionEventsTable.createdAt, lastCreatedAt),
                    ),
                  )
                  .orderBy(asc(executionEventsTable.createdAt));
              } else {
                /*
                 * Normally this branch won't be reached because
                 * existingEvents were loaded above, but it makes
                 * the polling logic safe.
                 */
                newEvents = await db
                  .select()
                  .from(executionEventsTable)
                  .where(eq(executionEventsTable.executionId, executionId))
                  .orderBy(asc(executionEventsTable.createdAt));
              }

              for (const event of newEvents) {
                sendEvent(event);

                if (TERMINAL_EVENTS.has(event.type)) {
                  close();
                  return;
                }
              }
            } catch (error) {
              console.error("Failed to poll execution events:", error);

              /*
               * Don't leave a broken SSE connection hanging.
               */
              close();
            }
          }, POLL_INTERVAL_MS);

          /*
           * ---------------------------------------------------------
           * 4. Handle client disconnect.
           * ---------------------------------------------------------
           */
          request.signal.addEventListener("abort", close, { once: true });
        } catch (error) {
          console.error("Failed to initialize execution event stream:", error);

          close();
        }
      },

      cancel() {
        /*
         * The client disconnected. The request abort handler
         * performs the actual cleanup.
         */
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",

        /*
         * Prevent buffering when running behind nginx/proxies
         * that support this header.
         */
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
