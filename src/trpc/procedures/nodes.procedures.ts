import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { nodesTable, nodeTypeEnum, projectsTable } from "@/db/schema";
import z from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { defaultNodeConfig } from "@/node.config";

export const nodesRouter = createTRPCRouter({
  getNodes: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const nodes = await db
        .select()
        .from(nodesTable)
        .where(eq(nodesTable.projectId, input.projectId));

      return nodes;
    }),
  add: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string(),
        description: z.string(),
        type: z.enum([
          "agent",
          "tool",
          "knowledge",
          "logic",
          "workflow",
          "human",
        ]),
        positionX: z.number().default(0),
        positionY: z.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [project] = await db
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.ownerId, ctx.auth.user.id));

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found.",
        });
      }

      if (project.archived) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot modify an archived project.",
        });
      }

      const defaults = {
        agent: {
          name: "New Agent",
          config: {},
        },
        tool: {
          name: "New Tool",
          config: {},
        },
        knowledge: {
          name: "New Knowledge",
          config: {},
        },
        logic: {
          name: "New Logic",
          config: {},
        },
        workflow: {
          name: "New Workflow",
          config: {},
        },
        human: {
          name: "New Human",
          config: {},
        },
      } as const;

      const [node] = await db
        .insert(nodesTable)
        .values({
          projectId: input.projectId,
          type: input.type,
          name: input.name,
          description: input.description,
          config: defaultNodeConfig[input.type],
          positionX: input.positionX,
          positionY: input.positionY,
        })
        .returning();

      return node;
    }),
});
