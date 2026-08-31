import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { OutputFlowNode } from "../../components/nodes/types/output-node";
import { getPreviousNode } from "../graph/get-previous-node";
import { ExecutionContextManager } from "./execution-context-manager";
import { executionEvents } from "./execution-events";

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

  const output = {
    type: "output" as const,
    text:
      previousOutput?.type === "agent"
        ? previousOutput.text
        : JSON.stringify(previousOutput),
  };

  contextManager.setOutput(node.id, output);

  contextManager.finishNode(node.id);

  executionEvents.emit({
    executionId: contextManager.getContext().executionId,
    nodeType: "output",
    type: "node:success",
    nodeId: node.id,
    nodeName: contextManager.getContext().nodeNames[node.id],
    timestamp: Date.now(),
    duration: 0,
    output,
  });
}
