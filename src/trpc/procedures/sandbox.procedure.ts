import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { sandboxFilesystem } from "@/features/sandbox/services/sandbox-filesystem";
import { sandboxTerminal } from "@/features/sandbox/services/sandbox-terminal";
import { tasks } from "@trigger.dev/sdk";
import { sandboxTerminalTask } from "@/trigger/tasks/sandbox-terminal";
import { sandboxManager } from "@/lib/sandbox/sandbox-manager";

const uploadFileSchema = z.object({
  sandboxId: z.string(),
  path: z.string(),
  content: z.string(),
});

const uploadZipSchema = z.object({
  sandboxId: z.string(),
  path: z.string(),
  base64: z.string(),
});

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

  getPreviewUrl: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string(),
        port: z.number().default(3000),
      }),
    )
    .query(async ({ input }) => {
      const sandbox = await sandboxManager.get(input.sandboxId);

      return {
        url: sandboxManager.getUrl(sandbox, input.port),
      };
    }),

  uploadFile: protectedProcedure
    .input(uploadFileSchema)
    .mutation(async ({ input }) => {
      await sandboxFilesystem.upload(
        input.sandboxId,
        input.path,
        input.content,
      );

      return {
        success: true,
      };
    }),

  uploadZip: protectedProcedure
    .input(uploadZipSchema)
    .mutation(async ({ input }) => {
      await sandboxFilesystem.uploadZip(
        input.sandboxId,
        input.path,
        input.base64,
      );

      return { success: true };
    }),

  downloadFile: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string(),
        path: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const content = await sandboxFilesystem.read(input.sandboxId, input.path);

      const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);

      return {
        content: buffer.toString("base64"),
      };
    }),
});
