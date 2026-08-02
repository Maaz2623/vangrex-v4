import { BaseEdgeData, BaseEdgeMetadata, FlowEdge } from "./base-edge";

export interface DefaultEdgeConfig extends Record<string, unknown> {}

export type DefaultFlowEdge = FlowEdge<DefaultEdgeConfig>;
