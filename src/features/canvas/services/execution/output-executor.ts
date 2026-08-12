

import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { OutputFlowNode } from "../../components/nodes/types/output-node";
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

  const previousNode = getPreviousNode(node.id, nodes, edges);

  if (!previousNode) {
    contextManager.finishNode(node.id);
    return;
  }

  const previousOutput = contextManager.getOutput(previousNode.id);

  contextManager.setOutput(node.id, {
    type: "output",
    text:
      previousOutput?.type === "agent"
        ? previousOutput.text
        : JSON.stringify(previousOutput),
  });

  contextManager.finishNode(node.id);
}
