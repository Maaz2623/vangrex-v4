export interface ExecutionContext {
  workflowId: string;
  startedAt: number;

  nodeNames: Record<string, string>;
}
