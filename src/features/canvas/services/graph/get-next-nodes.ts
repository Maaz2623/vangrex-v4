import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";

export function getNextNodes(
  nodeId: string,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
) {
  return edges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => nodes.find((node) => node.id === edge.target))
    .filter(Boolean) as AppFlowNode[];
}
