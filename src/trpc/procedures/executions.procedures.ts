import { observable } from "@trpc/server/observable";
import { createTRPCRouter, protectedProcedure } from "../init";
import { executionEvents } from "@/features/canvas/services/execution/execution-events";
import { ExecutionEvent } from "@/features/canvas/services/execution/event-types";
import z from "zod";
import { db } from "@/db";
import { executionNodesTable, executionsTable } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import {
  completeExecution,
  createExecution,
  failExecution,
} from "@/features/canvas/services/execution/execution-persistance";
import { ExecutionManager } from "@/features/canvas/services/execution/execution-manager";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/lib/inngest/client";
import { workflowChannel } from "@/lib/inngest/channels";

export const executionsRouter = createTRPCRouter({
  realtimeToken: protectedProcedure
    .input(
      z.object({
        executionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getClientSubscriptionToken(inngest, {
        channel: workflowChannel({
          executionId: input.executionId,
        }),
        topics: ["nodeStatus"],
      });
    }),
  execute: protectedProcedure
    .input(
      z.object({
        workflowId: z.uuid(),
        nodes: z.array(z.any()),
        edges: z.array(z.any()),
        input: z.unknown().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const executionId = crypto.randomUUID();

      await createExecution({
        id: executionId,
        workflowId: input.workflowId,
        input: input.input,
      });

      try {
        const manager = new ExecutionManager();

        const result = await manager.execute(input.nodes, input.edges, {
          workflowId: input.workflowId,
          input: input.input,
          executionId,
        });

        return {
          executionId,
        };
      } catch (error) {
        await failExecution(executionId, error);
        console.log(error);
        throw error;
      }
    }),
  get: protectedProcedure
    .input(
      z.object({
        executionId: z.uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [execution] = await db
        .select()
        .from(executionsTable)
        .where(eq(executionsTable.id, input.executionId));

      return execution;
    }),
  list: protectedProcedure
    .input(
      z.object({
        workflowId: z.uuid(),
      }),
    )
    .query(async ({ input }) => {
      const executions = await db
        .select()
        .from(executionsTable)
        .where(eq(executionsTable.workflowId, input.workflowId))
        .orderBy(desc(executionsTable.createdAt));

      const result = await Promise.all(
        executions.map(async (execution) => {
          const stats = await db
            .select({
              totalNodes: sql<number>`count(*)`,
              successfulNodes: sql<number>`
              count(*) filter (where ${executionNodesTable.status} = 'success')
            `,
              failedNodes: sql<number>`
              count(*) filter (where ${executionNodesTable.status} = 'error')
            `,
              runningNodes: sql<number>`
              count(*) filter (where ${executionNodesTable.status} = 'running')
            `,
              skippedNodes: sql<number>`
              count(*) filter (where ${executionNodesTable.status} = 'skipped')
            `,
            })
            .from(executionNodesTable)
            .where(eq(executionNodesTable.executionId, execution.id));

          return {
            ...execution,
            stats: {
              totalNodes: Number(stats[0]?.totalNodes ?? 0),
              successfulNodes: Number(stats[0]?.successfulNodes ?? 0),
              failedNodes: Number(stats[0]?.failedNodes ?? 0),
              runningNodes: Number(stats[0]?.runningNodes ?? 0),
              skippedNodes: Number(stats[0]?.skippedNodes ?? 0),
            },
          };
        }),
      );

      return result;
    }),

  events: protectedProcedure.subscription(() => {
    return observable<ExecutionEvent>((emit) => {
      const unsubscribe = executionEvents.subscribe((event) => {
        console.log("[execution-events] sending:", event);
        emit.next(event);
      });

      return unsubscribe;
    });
  }),
});
