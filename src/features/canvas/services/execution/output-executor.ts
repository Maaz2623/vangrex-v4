import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { OutputFlowNode } from "../../components/nodes/types";
import { ExecutionContextManager } from "./execution-context-manager";

export async function executeOutput(
  node: OutputFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  contextManager: ExecutionContextManager,
) {
  contextManager.incrementNodesExecuted();

  const context = contextManager.getContext();
}
