import { FlowEdge } from "../../components/edges/types/base-edge";
import { ExecutionContext } from "../execution/execution-context";
import { ExecutionOutput } from "../execution/execution-output";

export interface EdgeInput {
  edge: FlowEdge;
  output: ExecutionOutput;
}

export function getInputFromEdges(
  nodeId: string,
  edges: FlowEdge[],
  context: ExecutionContext,
): EdgeInput[] {
  return edges
    .filter((edge) => edge.target === nodeId && edge.sourceHandle === "output")
    .map((edge) => {
      const output = context.outputs[edge.source];

      if (!output) {
        return undefined;
      }

      return {
        edge,
        output,
      };
    })
    .filter((input): input is EdgeInput => input !== undefined);
}
