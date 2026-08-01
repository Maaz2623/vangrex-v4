import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export interface AgentConfig {
  model: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
}

export type AgentNodeData = BaseNodeData<AgentConfig>;

export type AgentFlowNode = FlowNode<AgentConfig>;
