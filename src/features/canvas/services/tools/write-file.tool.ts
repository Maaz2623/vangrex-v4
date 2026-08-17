import { tool } from "ai";
import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { ExecutionContext } from "../execution/execution-context";
import { Workspace, workspaceManager } from "../workspace/workspace-manager";
import z from "zod";
import { executeTool } from "../execution/execute-tool";

export function createWriteFileTool(
  node: ToolFlowNode,
  context: ExecutionContext,
  workspace: Workspace,
) {
  return tool({
    description:
      node.data.description ||
      "Write content to a file in the current workspace.",
    inputSchema: z.object({
      path: z.string().describe("Path of the file relative to the workspace."),
      content: z
        .string()
        .describe("The complete content that should be written to the file"),
    }),
    execute: async ({ path, content }) => {
      executeTool(node, context, async () => {
        await workspaceManager.writeFile(workspace, path, content);

        return {
          path,
          success: true,
        };
      });
    },
  });
}
