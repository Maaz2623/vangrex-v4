import { ExecutionOutput } from "./execution-output";

export interface ExecutionContext {
  workflowId: string;
  startedAt: number;

  nodeNames: Record<string, string>;

  outputs: Record<string, ExecutionOutput>;
}
