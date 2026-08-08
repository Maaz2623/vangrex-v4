import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";

export interface NodeExecutor<T extends AppFlowNode = AppFlowNode> {
  execute(
    node: T,
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    contextManager: ExecutionContextManager,
  ): Promise<void>;
}
