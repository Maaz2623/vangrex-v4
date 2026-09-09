import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { sandboxFilesystem } from "@/features/sandbox/services/sandbox-filesystem";
import { sandboxTerminal } from "@/features/sandbox/services/sandbox-terminal";
import { tasks } from "@trigger.dev/sdk";
import { sandboxTerminalTask } from "@/trigger/tasks/sandbox-terminal";

export const sandboxRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string(),
        path: z.string().default("/"),
      }),
    )
    .query(async ({ input }) => {
      return await sandboxFilesystem.list(input.sandboxId, input.path);
    }),

  read: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string(),
        path: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await sandboxFilesystem.read(input.sandboxId, input.path);
    }),

  write: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string(),
        path: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await sandboxFilesystem.write(input.sandboxId, input.path, input.content);

      return { success: true };
    }),

  createDirectory: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string(),
        path: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await sandboxFilesystem.createDirectory(input.sandboxId, input.path);

      return { success: true };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string(),
        path: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await sandboxFilesystem.delete(input.sandboxId, input.path);

      return { success: true };
    }),

  rename: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string(),
        oldPath: z.string(),
        newPath: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await sandboxFilesystem.rename(
        input.sandboxId,
        input.oldPath,
        input.newPath,
      );

      return { success: true };
    }),

  startTerminal: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string(),
        cols: z.number().default(120),
        rows: z.number().default(30),
      }),
    )
    .mutation(async ({ input }) => {
      const handle = await tasks.trigger<typeof sandboxTerminalTask>(
        "sandbox-terminal",
        {
          sandboxId: input.sandboxId,
          cols: input.cols,
          rows: input.rows,
        },
      );

      return {
        runId: handle.id,
      };
    }),
});
