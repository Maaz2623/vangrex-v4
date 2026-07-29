import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import { projectsTable, workflowsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const workflowsRouter = createTRPCRouter({
  getWorkflowName: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        workflowId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
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

      const [workflow] = await db
        .select()
        .from(workflowsTable)
        .where(eq(workflowsTable.id, input.workflowId));

      return workflow.name;
    }),
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

  deleteWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        projectId: z.string(),
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

      const [deletedWorkflow] = await db
        .delete(workflowsTable)
        .where(eq(workflowsTable.id, input.workflowId))
        .returning();

      return {
        name: deletedWorkflow.name,
        id: deletedWorkflow.id,
        projectId: project.id,
      };
    }),
});
