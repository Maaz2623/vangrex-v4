export interface ExecutionStats {
  nodesExecuted: number;

  toolsExecuted: number;

  agentsExecuted: number;

  errors: number;

  startedAt: number;

  completedAt?: number;

  duration?: number;
}
