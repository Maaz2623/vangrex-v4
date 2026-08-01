import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export interface FunctionConfig extends NodeConfig {
  language: "javascript" | "typescript";
  runtime: "node";
  code: string;
}

export type FunctionNodeData = BaseNodeData<FunctionConfig>;

export type FunctionFlowNode = FlowNode<FunctionConfig>;
