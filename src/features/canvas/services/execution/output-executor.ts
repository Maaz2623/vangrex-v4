import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { OutputFlowNode } from "../../components/nodes/types";
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

  console.log("[output] previousNode:", previousNode);

  if (!previousNode) {
    console.log("[output] NO PREVIOUS NODE");
    contextManager.finishNode(node.id);
    return;
  }

  const previousOutput = contextManager.getOutput(previousNode.id);

  console.log("[output] previousOutput:", previousOutput);
  console.log("[output] previousOutput type:", previousOutput?.type);

  const outputText =
    previousOutput?.type === "agent"
      ? previousOutput.text
      : JSON.stringify(previousOutput);

  console.log("[output] outputText:", outputText);

  contextManager.setOutput(node.id, {
    type: "output",
    text: outputText ?? "No output available",
  });

  console.log("[output] final:", contextManager.getOutput(node.id));

  contextManager.finishNode(node.id);
}
