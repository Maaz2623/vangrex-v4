import z from "zod";
import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { tool } from "ai";

export function createTool(toolNode: ToolFlowNode) {
  return tool({
    description: toolNode.data.description,
    inputSchema: z.object({}),
    execute: async () => {
      return "Weather is very sunnny but it is rainy!";
    },
  });
}

export function createTools(toolNodes: ToolFlowNode[]) {
  return Object.fromEntries(
    toolNodes.map((toolNode) => [
      toolNode.data.config.implementation,
      createTool(toolNode),
    ]),
  );
}
