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

  try {
    const input = getInputFromEdges(node.id, edges, context);

    console.log("[output node] input:", input);

    const text = input
      .map((item) => {
        if (item.output.type === "agent") {
          return item.output.text;
        }

        if (item.output.type === "output") {
          return item.output.text;
        }

        if (item.output.type === "knowledge") {
          return item.output.documents.join("\n");
        }

        if (
          item.output.type === "tool" ||
          item.output.type === "human" ||
          item.output.type === "github"
        ) {
          return JSON.stringify(item.output.value);
        }

        if (item.output.type === "sandbox") {
          return item.output.sandboxId;
        }

        return "";
      })
      .filter(Boolean)
      .join("\n");

    contextManager.setOutput(node.id, {
      type: "output",
      text,
    });

    contextManager.finishNode(node.id);
  } catch (error) {
    contextManager.failNode(node.id);
    throw error;
  }
}
