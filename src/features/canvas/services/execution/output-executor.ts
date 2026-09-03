import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { OutputFlowNode } from "../../components/nodes/types";
import { getInputFromEdges } from "../graph/get-inputs-from-edges";
import { ExecutionContextManager } from "./execution-context-manager";
import { PublishNodeStatus } from "./graph-executor";

export async function executeOutput(
  node: OutputFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  contextManager: ExecutionContextManager,
  userId: string,
  publishNodeStatus: PublishNodeStatus,
) {
  contextManager.startNode(node.id);
  contextManager.incrementNodesExecuted();

  const context = contextManager.getContext();

  if (!context.executionId) {
    throw new Error("Execution Id is required");
  }

  await publishNodeStatus({
    executionId: context.executionId,
    nodeId: node.id,
    status: "running",
  });

  try {
    const input = getInputFromEdges(node.id, edges, context);

    console.log("[output node] input:", input);

    contextManager.finishNode(node.id);

    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: node.id,
      status: "success",
    });
  } catch (error) {
    contextManager.failNode(node.id);

    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: node.id,
      status: "error",
    });

    throw error;
  }
}
