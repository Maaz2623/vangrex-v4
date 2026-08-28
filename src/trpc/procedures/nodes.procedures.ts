import z from "zod";
import { eq, or } from "drizzle-orm";

import { db } from "@/db";
import { edgesTable, githubConnections, nodesTable } from "@/db/schema";

import type { AppFlowNode } from "@/features/canvas/components/nodes/node-config";

import { createTRPCRouter, protectedProcedure } from "../init";

import { assertWorkflowOwner } from "../utils/assert-workflow-owner";
import { assertNodeOwner } from "../utils/assert-node-owner";
import { TRPCError } from "@trpc/server";

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

        position: z
          .object({
            x: z.number(),
            y: z.number(),
          })
          .optional(),

        title: z.string().optional(),
        description: z.string().nullable().optional(),

        config: z.record(z.string(), z.unknown()).optional(),

        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(nodesTable)
        .where(eq(nodesTable.id, input.id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found.",
        });
      }

      // Verify workflow ownership
      await assertWorkflowOwner(existing.workflowId, ctx.auth.user.id);

      const updateData: {
        positionX?: number;
        positionY?: number;
        title?: string;
        description?: string | null;
        config?: Record<string, unknown>;
        metadata?: Record<string, unknown>;
      } = {};

      if (input.position) {
        updateData.positionX = input.position.x;
        updateData.positionY = input.position.y;
      }

      if (input.title !== undefined) {
        updateData.title = input.title;
      }

      if (input.description !== undefined) {
        updateData.description = input.description;
      }

      if (input.config !== undefined) {
        updateData.config = input.config;
      }

      if (input.metadata !== undefined) {
        updateData.metadata = input.metadata;
      }

      if (Object.keys(updateData).length === 0) {
        return {
          success: true,
        };
      }

      await db
        .update(nodesTable)
        .set(updateData)
        .where(eq(nodesTable.id, input.id));

      return {
        success: true,
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(nodesTable)
        .where(eq(nodesTable.id, input.id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      await assertNodeOwner(input.id, ctx.auth.user.id);

      // Delete GitHub connection owned by this node
      if (existing.type === "github") {
        const config = existing.config as {
          connectionId?: string;
        };

        if (config.connectionId) {
          await db
            .delete(githubConnections)
            .where(eq(githubConnections.id, config.connectionId));
        }
      }

      // Delete connected edges
      await db
        .delete(edgesTable)
        .where(
          or(eq(edgesTable.source, input.id), eq(edgesTable.target, input.id)),
        );

      // Delete the node
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
