import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const projectsRouter = createTRPCRouter({
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

      return project.id;
    }),
});
