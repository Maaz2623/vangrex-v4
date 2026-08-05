export interface ExecutionNodeState {
  nodeId: string;
  status: "pending" | "running" | "success" | "error";
  startedAt?: number;
  completedAt?: number;
  duration?: number;
}
