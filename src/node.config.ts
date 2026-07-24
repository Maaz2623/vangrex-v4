export interface AgentConfig {
  provider: string;
  model: string;
  instructions: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
}

export interface ToolConfig {
  provider: string;
  tool: string;
}

export interface KnowledgeConfig {
  source: string;
}

export interface LogicConfig {
  condition: string;
}

export interface WorkflowConfig {
  workflowId: string;
}

export interface HumanConfig {}

export interface NodeConfigMap {
  agent: AgentConfig;
  tool: ToolConfig;
  knowledge: KnowledgeConfig;
  logic: LogicConfig;
  workflow: WorkflowConfig;
  human: HumanConfig;
}

export type NodeType = keyof NodeConfigMap;

export type NodeConfig = NodeConfigMap[NodeType];

export const defaultNodeConfig: NodeConfigMap = {
  agent: {
    provider: "",
    model: "",
    instructions: "",
  },

  tool: {
    provider: "",
    tool: "",
  },

  knowledge: {
    source: "",
  },

  logic: {
    condition: "",
  },

  workflow: {
    workflowId: "",
  },

  human: {},
};
