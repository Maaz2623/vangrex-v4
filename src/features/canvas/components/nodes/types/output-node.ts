import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export type OutputConfig = Record<string, never>;

export interface OutputNodeData extends NodeConfig {}

export type OutputFlowNode = FlowNode<OutputConfig, "output">;
