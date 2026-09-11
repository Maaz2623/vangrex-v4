export interface RunWorkflowResponse {
  executionId: string;
  status: string;
}

export interface Execution {
  id: string;
  workflowId: string;
  status: "pending" | "running" | "success" | "error" | "cancelled";
  input: unknown;
  output: unknown;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export type ExecutionEventType =
  | "execution.started"
  | "node.started"
  | "node.output"
  | "node.completed"
  | "node.failed"
  | "execution.completed"
  | "execution.failed";

export interface ExecutionEventData {
  nodeId?: string;
  status?: string;
  output?: unknown;
  error?: string;
}

export interface ExecutionEvent {
  id: string;
  executionId: string;
  workflowId: string;
  type: ExecutionEventType;
  timestamp: string;
  data: ExecutionEventData;
}
