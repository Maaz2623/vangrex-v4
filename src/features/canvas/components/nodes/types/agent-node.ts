import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";
import { NodeCategory } from "./node-definition";

export interface AgentConfig extends NodeConfig {
  model: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
}

export type AgentNodeData = BaseNodeData<AgentConfig>;

export type AgentFlowNode = FlowNode<AgentConfig, "agent">;
