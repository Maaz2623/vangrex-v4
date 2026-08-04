export interface AgentExecutionOutput {
  type: "agent";
  text: string;
}

export interface ToolExecutionOutput {
  type: "tool";
  value: unknown;
}

export type ExecutionOutput = AgentExecutionOutput | ToolExecutionOutput;
