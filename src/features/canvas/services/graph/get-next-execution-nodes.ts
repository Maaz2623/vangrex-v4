import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";

export function getNextExecutionNodes(
  nodeId: string,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
): AppFlowNode[] {
  return edges
    .filter(
      (edge) => edge.source === nodeId && edge.sourceHandle === "output", // execution edges only
    )
    .map((edge) => nodes.find((node) => node.id === edge.target))
    .filter(
      (node): node is AppFlowNode =>
        node !== undefined && node.type !== "tool-call",
    );
}
