import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export interface VariableConfig extends NodeConfig {
  name: string;
  value: string;
}

export type VariableNodeData = BaseNodeData<VariableConfig>;

export type VariableFlowNode = FlowNode<VariableConfig, "variable">;
