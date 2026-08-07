import z from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { edgesTable } from "@/db/schema";

import { createTRPCRouter, protectedProcedure } from "../init";

import { assertWorkflowOwner } from "../utils/assert-workflow-owner";
import { TRPCError } from "@trpc/server";
import { BaseEdgeMetadata } from "@/features/canvas/components/edges/types/base-edge";

export const edgesRouter = createTRPCRouter({
  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------

  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),

        edge: z.object({
          id: z.string(),
          source: z.string(),
          target: z.string(),

          sourceHandle: z.string().nullable().optional(),
          targetHandle: z.string().nullable().optional(),

          config: z.record(z.string(), z.unknown()),
          metadata: z.custom<BaseEdgeMetadata>(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertWorkflowOwner(input.workflowId, ctx.auth.user.id);

      await db.insert(edgesTable).values({
        id: input.edge.id,

        workflowId: input.workflowId,

        source: input.edge.source,
        target: input.edge.target,

        sourceHandle: input.edge.sourceHandle ?? null,
        targetHandle: input.edge.targetHandle ?? null,

        config: input.edge.config,
        metadata: input.edge.metadata,
      });

      return {
        success: true,
      };
    }),

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),

        edge: z.object({
          source: z.string(),
          target: z.string(),

          sourceHandle: z.string().nullable().optional(),
          targetHandle: z.string().nullable().optional(),

          config: z.record(z.string(), z.unknown()),
          metadata: z.custom<BaseEdgeMetadata>(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(edgesTable)
        .where(eq(edgesTable.id, input.id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Edge not found.",
        });
      }

      await assertWorkflowOwner(existing.workflowId, ctx.auth.user.id);

      await db
        .update(edgesTable)
        .set({
          source: input.edge.source,
          target: input.edge.target,

          sourceHandle: input.edge.sourceHandle ?? null,
          targetHandle: input.edge.targetHandle ?? null,

          config: input.edge.config,
          metadata: input.edge.metadata,
        })
        .where(eq(edgesTable.id, input.id));

      return {
        success: true,
      };
    }),

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await db
        .select()
        .from(edgesTable)
        .where(eq(edgesTable.id, input.id));

      if (!existing) {
        throw new Error("Edge not found.");
      }

      await assertWorkflowOwner(existing.workflowId, ctx.auth.user.id);

      await db.delete(edgesTable).where(eq(edgesTable.id, input.id));

      return {
        success: true,
      };
    }),

  // --------------------------------------------------
  // LIST
  // --------------------------------------------------

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
        .from(edgesTable)
        .where(eq(edgesTable.workflowId, input.workflowId));
    }),
});
