import { AgentConfig, NodeConfig } from "@/node.config";
import { Node } from "@xyflow/react";

export type FlowNodeData<TConfig = NodeConfig> = {
  id: string;
  name: string;
  description: string;
  config: TConfig;
};

export type FlowNode<
  TConfig = NodeConfig,
  TType extends string = string,
> = Node<FlowNodeData<TConfig>, TType>;
