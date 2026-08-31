import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "../init";

import {
  createCredential,
  getCredential,
  deleteCredential,
} from "@/features/credentials/services/credential-service";

import { z } from "zod";
import { credentialsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const credentialsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select({
        id: credentialsTable.id,
        name: credentialsTable.name,
      })
      .from(credentialsTable)
      .where(eq(credentialsTable.userId, ctx.auth.user.id));
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return createCredential(ctx.auth.user.id, input.name, input.value);
    }),

  get: protectedProcedure
    .input(
      z.object({
        credentialId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const credential = await getCredential(
        ctx.auth.user.id,
        input.credentialId,
      );

      if (!credential) {
        throw new Error("Credential not found");
      }

      return {
        id: credential.id,
        name: credential.name,
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        credentialId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return deleteCredential(ctx.auth.user.id, input.credentialId);
    }),
});
