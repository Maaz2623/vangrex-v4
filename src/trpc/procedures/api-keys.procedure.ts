import { z } from "zod";

import { db } from "@/db";
import { apiKeysTable, projectsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

import {
  createApiKey,
  revokeApiKey,
} from "@/features/api-keys/api-key-service";
import { createTRPCRouter, protectedProcedure } from "../init";

export const apiKeysRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        name: z.string().min(1).max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [project] = await db
        .select({
          id: projectsTable.id,
        })
        .from(projectsTable)
        .where(
          and(
            eq(projectsTable.id, input.projectId),
            eq(projectsTable.ownerId, ctx.auth.user.id),
          ),
        )
        .limit(1);

      if (!project) {
        throw new Error("Project not found");
      }

      return createApiKey({
        projectId: project.id,
        userId: ctx.auth.user.id,
        name: input.name,
      });
    }),

  revoke: protectedProcedure
    .input(
      z.object({
        apiKeyId: z.uuid()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [apiKey] = await db
        .select({
          id: apiKeysTable.id,
        })
        .from(apiKeysTable)
        .where(
          and(
            eq(apiKeysTable.id, input.apiKeyId),
            eq(apiKeysTable.userId, ctx.auth.user.id),
          ),
        )
        .limit(1);

      if (!apiKey) {
        throw new Error("API key not found");
      }

      await revokeApiKey(apiKey.id);

      return {
        success: true,
      };
    }),
});
