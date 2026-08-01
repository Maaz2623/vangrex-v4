import { NodeStatusType } from "./node-status";

export interface BaseNodeData<TConfig = unknown> extends Record<
  string,
  unknown
> {
  title: string;
  description?: string;

  config: TConfig;

  metadata: {
    status?: NodeStatusType;

    disabled: boolean;

    collapsed: boolean;

    locked: boolean;
  };
}
