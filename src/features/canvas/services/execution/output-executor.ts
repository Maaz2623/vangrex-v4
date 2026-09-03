import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { OutputFlowNode } from "../../components/nodes/types";
import { getInputFromEdges } from "../graph/get-inputs-from-edges";
import { getPreviousNode } from "../graph/get-previous-node";
import { ExecutionContextManager } from "./execution-context-manager";

export async function executeOutput(
  node: OutputFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  contextManager: ExecutionContextManager,
) {
  contextManager.startNode(node.id);
  contextManager.incrementNodesExecuted();

  const context = contextManager.getContext();
  const input = getInputFromEdges(node.id, edges, context);

  console.log("[output node] input:", input);

  contextManager.finishNode(node.id);
}
