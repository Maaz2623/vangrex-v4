import { NodeStatusType } from "../../components/nodes/types";

export interface ExecutionNodeState {
  nodeId: string;
  status: NodeStatusType;
  startedAt?: number;
  completedAt?: number;
  duration?: number;
}
