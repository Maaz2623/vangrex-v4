import { tool } from "ai";
import { z } from "zod";

import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { ExecutionContext } from "../execution/execution-context";
import { executeTool } from "../execution/execute-tool";
import { sandboxManager } from "@/lib/sandbox/sandbox-manager";

export function createWriteFileTool(
  node: ToolFlowNode,
  context: ExecutionContext,
) {
  return tool({
    description:
      node.data.description ||
      "Write content to a file in the current sandbox.",

    inputSchema: z.object({
      path: z
        .string()
        .describe("Path of the file relative to the sandbox workspace."),

      content: z
        .string()
        .describe("The complete content that should be written to the file."),
    }),

    execute: async ({ path, content }) =>
      executeTool(node, context, async () => {
        const sandboxId = context.metadata.sandboxId as string | undefined;

        if (!sandboxId) {
          throw new Error(
            "No sandbox available. Add a Sandbox node before using file tools.",
          );
        }

        const sandbox = await sandboxManager.get(sandboxId);

        console.log("[write-file] sandbox:", sandbox.id);
        console.log("[write-file] path:", path);

        await sandbox.sandbox.files.write(path, content);

        return {
          path,
          success: true,
        };
      }),
  });
}
