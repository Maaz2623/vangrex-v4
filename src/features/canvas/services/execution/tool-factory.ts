import z from "zod";
import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { tool } from "ai";
import { toolRegistry } from "../tools";
import { ExecutionContext } from "./execution-context";
import { Workspace } from "../workspace/workspace-manager";

export function createTools(
  toolNodes: ToolFlowNode[],
  context: ExecutionContext,
  workspace: Workspace,
) {
  return Object.fromEntries(
    toolNodes.map((toolNode) => {
      const implementation = toolNode.data.config.implementation;

      const factory = toolRegistry[implementation];

      if (!factory) {
        throw new Error(`Unknown tool: ${implementation}`);
      }

      return [implementation, factory(toolNode, context, workspace)];
    }),
  );
}
