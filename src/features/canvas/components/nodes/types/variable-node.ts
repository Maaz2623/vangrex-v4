import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export interface VariableConfig {
  name: string;
  value: string;
}

export type VariableNodeData = BaseNodeData<VariableConfig>;

export type VariableFlowNode = FlowNode<VariableConfig, "variable">;
