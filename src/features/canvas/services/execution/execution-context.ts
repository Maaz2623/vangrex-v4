import { ExecutionArtifact } from "./execution-artifact";
import { ExecutionNodeState } from "./execution-node-state";
import { ExecutionOutput } from "./execution-output";
import { ExecutionStats } from "./execution-stats";

export interface ExecutionContext {
  executionId?: string;

  workflowId: string;
  startedAt: number;

  nodeNames: Record<string, string>;

  outputs: Record<string, ExecutionOutput>;

  artifacts: ExecutionArtifact[];

  variables: Record<string, unknown>;

  metadata: Record<string, unknown>;

  nodeStates: Record<string, ExecutionNodeState>;

  stats: ExecutionStats;
}
