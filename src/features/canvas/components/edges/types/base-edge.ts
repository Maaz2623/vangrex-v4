import { Edge } from "@xyflow/react";

export interface BaseEdgeMetadata {
  animated: boolean;
  executionCount: number;
  disabled: boolean;
  lastExecutedAt?: Date;
}

export interface BaseEdgeData<
  TConfig extends Record<string, unknown> = Record<string, unknown>,
> extends Record<string, unknown> {
  config: TConfig;
  metadata: BaseEdgeMetadata;
}

export type FlowEdge<
  TConfig extends Record<string, unknown> = Record<string, unknown>,
> = Edge<BaseEdgeData<TConfig>>;
