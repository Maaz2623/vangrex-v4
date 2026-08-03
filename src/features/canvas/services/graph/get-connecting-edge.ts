import { FlowEdge } from "../../components/edges/types/base-edge";

export function getConnectingEdge(
  nodeA: string,
  nodeB: string,
  edges: FlowEdge[],
) {
  return edges.find(
    (edge) =>
      (edge.source === nodeA && edge.target === nodeB) ||
      (edge.source === nodeB && edge.target === nodeA),
  );
}
