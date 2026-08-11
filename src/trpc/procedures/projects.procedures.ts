import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createSvixApplication } from "@/features/webhooks/services/svix-application";

export const projectsRouter = createTRPCRouter({
  getProjectName: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
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

      return project.name;
    }),
  deleteProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(projectsTable)
        .where(
          and(
            eq(projectsTable.ownerId, ctx.auth.user.id),
            eq(projectsTable.id, input.projectId),
          ),
        );
    }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.ownerId, ctx.auth.user.id));

    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [project] = await db
        .insert(projectsTable)
        .values({
          name: input.name,
          description: input.description,
          ownerId: ctx.auth.user.id,
        })
        .returning();

      const svixApp = await createSvixApplication({
        projectId: project.id,
        projectName: project.name,
      });

      const [updatedProject] = await db
        .update(projectsTable)
        .set({
          svixAppId: svixApp.id,
        })
        .where(eq(projectsTable.id, project.id))
        .returning();

      return updatedProject.id;
    }),
});
