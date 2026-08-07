import {
  BaseEdgeMetadata,
  FlowEdge,
} from "../../components/edges/types/base-edge";

type DbEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  config: unknown;
  metadata: unknown;
};

export function dbEdgeToFlowEdge(edge: DbEdge): FlowEdge {
  return {
    id: edge.id,

    source: edge.source,
    target: edge.target,

    sourceHandle: edge.sourceHandle ?? undefined,
    targetHandle: edge.targetHandle ?? undefined,

    type: "default",

    data: {
      config: edge.config as Record<string, unknown>,
      metadata: edge.metadata as BaseEdgeMetadata,
    },
  };
}
