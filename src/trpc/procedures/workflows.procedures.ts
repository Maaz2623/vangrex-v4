import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import { projectsTable, workflowsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const workflowsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [project] = await db
        .select()
        .from(projectsTable)
        .where(
          and(
            eq(projectsTable.id, input.projectId),
            eq(projectsTable.ownerId, ctx.auth.user.id),
          ),
        );

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found.",
        });
      }

      const [newWorkflow] = await db
        .insert(workflowsTable)
        .values({
          projectId: project.id,
          name: input.name,
          description: input.description,
        })
        .returning();

      return {
        projectId: project.id,
        workflowId: newWorkflow.id,
      };
    }),
  getWorkflows: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [project] = await db
        .select()
        .from(projectsTable)
        .where(
          and(
            eq(projectsTable.id, input.projectId),
            eq(projectsTable.ownerId, ctx.auth.user.id),
          ),
        );

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found.",
        });
      }

      const workflows = await db
        .select()
        .from(workflowsTable)
        .where(eq(workflowsTable.projectId, input.projectId));

      return workflows;
    }),
});
