export interface AgentOutput {
  type: "agent";
  text: string;
}

export interface ToolOutput<T = unknown> {
  type: "tool";
  value: T;
}

export interface KnowledgeOutput {
  type: "knowledge";
  documents: string[];
}

export interface HumanOutput<T = unknown> {
  type: "human";
  value: T;
}

export interface ResultOutput<T = unknown> {
  type: "output";
  text: string;
}

export type ExecutionOutput =
  | AgentOutput
  | ToolOutput
  | KnowledgeOutput
  | HumanOutput
  | ResultOutput;
