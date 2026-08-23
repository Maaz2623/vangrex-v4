import { tool } from "ai";
import { z } from "zod";

import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { executeTool } from "../execution/execute-tool";
import { ExecutionContext } from "../execution/execution-context";
import { Workspace, workspaceManager } from "../workspace/workspace-manager";
import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";

export function createReadFileTool(
  node: ToolFlowNode,
  context: ExecutionContext,
  sandbox: SandboxInstance,
) {
  return tool({
    description:
      node.data.description ||
      "Read the contents of a file from the current workspace.",

    inputSchema: z.object({
      path: z.string().describe("Path of the file relative to the workspace."),
    }),

    execute: async ({ path }) =>
      executeTool(node, context, async () => {
        return await sandbox.sandbox.files.read(path)
      }),
  });
}
