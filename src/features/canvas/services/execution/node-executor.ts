import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { ExecutionContext } from "./execution-context";

export interface NodeExecutor<T extends AppFlowNode = AppFlowNode> {
  execute(
    node: T ,
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    context: ExecutionContext,
  ): Promise<void>;
}
