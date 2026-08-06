import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";

export function getPreviousNode(
  nodeId: string,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
): AppFlowNode | undefined {
  const edge = edges.find((edge) => edge.target === nodeId);

  if (!edge) {
    return undefined;
  }

  return nodes.find((node) => node.id === edge.source);
}
