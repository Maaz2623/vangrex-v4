import { tool } from "ai";
import { z } from "zod";

import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { executeTool } from "../execution/execute-tool";
import { ExecutionContext } from "../execution/execution-context";
import { sandboxManager } from "@/lib/sandbox/sandbox-manager";
import { PublishNodeStatus } from "../execution/graph-executor";

export function createReadFileTool(
  node: ToolFlowNode,
  context: ExecutionContext,
  publishNodeStatus: PublishNodeStatus
) {
  return tool({
    description:
      node.data.description ||
      "Read the contents of a file from the current sandbox.",

    inputSchema: z.object({
      path: z
        .string()
        .describe("Path of the file relative to the sandbox workspace."),
    }),

    execute: async ({ path }) =>
      executeTool(node, context, async () => {
        const sandboxId = context.metadata.sandboxId as string | undefined;

        if (!sandboxId) {
          throw new Error(
            "No sandbox available. Add a Sandbox node before using file tools.",
          );
        }

        const sandbox = await sandboxManager.get(sandboxId);

        console.log("[read-file] sandbox:", sandbox.id);
        console.log("[read-file] path:", path);

        return await sandbox.sandbox.files.read(path);
      }, publishNodeStatus),
  });
}
