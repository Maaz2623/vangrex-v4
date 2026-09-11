import { NodeStatusType } from "../../components/nodes/types";
import { ExecutionOutput } from "./execution-output";

export type ExecutionEventType =
  | "execution.started"
  | "node.started"
  | "node.output"
  | "node.completed"
  | "node.failed"
  | "execution.completed"
  | "execution.failed";

export interface VangrexExecutionEvent {
  id: string;
  executionId: string;
  type: ExecutionEventType;
  workflowId: string;
  timestamp: string;

  data: {
    nodeId?: string;
    status?: NodeStatusType;
    output?: ExecutionOutput;
    error?: string;
  };
}
