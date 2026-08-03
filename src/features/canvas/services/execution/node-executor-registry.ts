import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { executeAgent } from "./agent-executor";
import { ExecutionContext } from "./execution-context";

type Executor = (
  node: AppFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  context: ExecutionContext,
) => Promise<void>;

export const nodeExecutorRegistry: Record<string, Executor> = {
  agent: (node, nodes, edges, context) =>
    executeAgent(node as any, nodes, edges, context),
};
