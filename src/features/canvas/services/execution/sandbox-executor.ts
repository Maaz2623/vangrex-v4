import { SandboxInstance, sandboxManager } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { SandboxFlowNode } from "../../components/nodes/types/sandbox-node";

import { ExecutionContextManager } from "./execution-context-manager";
import { executionEvents } from "./execution-events";

export async function executeSandbox(
  node: SandboxFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  contextManager: ExecutionContextManager,
  userId: string,
): Promise<void> {
  contextManager.startNode(node.id);
  contextManager.incrementNodesExecuted();

  const started = performance.now();

  executionEvents.emit({
    executionId: contextManager.executionId,
    nodeType: "sandbox",
    type: "node:start",
    nodeId: node.id,
    timestamp: Date.now(),
    nodeName: node.data.title,
  });

  try {
    const sandbox = await sandboxManager.create();

    console.log("[sandbox node] created:", sandbox.id);

    contextManager.setMetadata("sandboxId", sandbox.id);

    contextManager.finishNode(node.id);

    executionEvents.emit({
      executionId: contextManager.executionId,
      nodeType: "sandbox",
      type: "node:success",
      nodeId: node.id,
      timestamp: Date.now(),
      nodeName: node.data.title,
      duration: performance.now() - started,
    });
  } catch (error) {
    contextManager.incrementErrors();
    contextManager.failNode(node.id);

    executionEvents.emit({
      executionId: contextManager.executionId,
      nodeType: "sandbox",
      type: "node:error",
      nodeId: node.id,
      nodeName: node.data.title,
      error: error instanceof Error ? error : new Error(String(error)),
      timestamp: Date.now(),
      duration: performance.now() - started,
    });

    throw error;
  }
}
