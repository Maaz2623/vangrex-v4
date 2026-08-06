import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";

export function getStartNodes(
  nodes: AppFlowNode[],
  edges: FlowEdge[],
): AppFlowNode[] {
  return nodes.filter((node) => {
    const hasIncomingEdge = edges.some((edge) => edge.target === node.id);

    return !hasIncomingEdge;
  });
}
