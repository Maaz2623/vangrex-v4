import { BaseEdgeData, BaseEdgeMetadata, FlowEdge } from "./base-edge";

export interface DefaultEdgeConfig extends Record<string, unknown> {}

export interface DefaultEdgeData extends BaseEdgeData {
  config: DefaultEdgeConfig;
}

export type DefaultFlowEdge = FlowEdge<DefaultEdgeData>;
