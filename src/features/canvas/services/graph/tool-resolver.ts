import { Edge } from "@xyflow/react";

import { AppFlowNode } from "../../components/nodes/node-config";
import { ToolFlowNode } from "../../components/nodes/types/tool-node";

export function getConnectedTools(
  agentId: string,
  nodes: AppFlowNode[],
  edges: Edge[],
): ToolFlowNode[] {
  const connectedToolIds = edges
    .filter((edge) => edge.target === agentId)
    .map((edge) => edge.source);

  return nodes.filter(
    (node): node is ToolFlowNode =>
      node.type === "tool-call" && connectedToolIds.includes(node.id),
  );
}
