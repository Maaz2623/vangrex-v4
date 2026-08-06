import z from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { nodesTable } from "@/db/schema";

import type { AppFlowNode } from "@/features/canvas/components/nodes/node-config";

import { createTRPCRouter, protectedProcedure } from "../init";

import { assertWorkflowOwner } from "../utils/assert-workflow-owner";
import { assertNodeOwner } from "../utils/assert-node-owner";

export const nodesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        node: z.custom<AppFlowNode>(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await assertWorkflowOwner(
        input.workflowId,
        ctx.auth.user.id,
      );

      const node = input.node;

      await db.insert(nodesTable).values({
        id: node.id,
        workflowId: workflow.id,
        type: node.type,
        title: node.data.title,
        description: node.data.description,
        positionX: node.position.x,
        positionY: node.position.y,
        config: node.data.config,
        metadata: node.data.metadata,
      });

      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        node: z.custom<AppFlowNode>(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertNodeOwner(input.id, ctx.auth.user.id);

      const node = input.node;

      await db
        .update(nodesTable)
        .set({
          type: node.type,
          title: node.data.title,
          description: node.data.description,
          positionX: node.position.x,
          positionY: node.position.y,
          config: node.data.config,
          metadata: node.data.metadata,
        })
        .where(eq(nodesTable.id, input.id));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertNodeOwner(input.id, ctx.auth.user.id);

      await db.delete(nodesTable).where(eq(nodesTable.id, input.id));

      return { success: true };
    }),

  listByWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertWorkflowOwner(input.workflowId, ctx.auth.user.id);

      return db
        .select()
        .from(nodesTable)
        .where(eq(nodesTable.workflowId, input.workflowId));
    }),
});
