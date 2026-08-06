import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export type VariableType = "text" | "number" | "json" | "boolean";

export interface VariableConfig extends NodeConfig {
  name: string;
  type: VariableType;
  value: string;
  description: string;
  secret: boolean;
  editable: boolean;
  global: boolean;
}

export type VariableNodeData = BaseNodeData<VariableConfig>;

export type VariableFlowNode = FlowNode<VariableConfig, "variable">;
