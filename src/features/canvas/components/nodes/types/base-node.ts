import { NodeStatusType } from "./node-status";

export interface BaseNodeData<TConfig = unknown> extends Record<
  string,
  unknown
> {
  title: string;
  description?: string;

  status?: NodeStatusType;

  config: TConfig;
}
