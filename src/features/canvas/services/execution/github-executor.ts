import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";
import { GithubFlowNode } from "../../components/nodes/types";
import { ExecutionContextManager } from "./execution-context-manager";
import { getGithubConnection } from "@/features/github/services/github-connection-service";
import { executionEvents } from "./execution-events";

export async function executeGithub(
  node: GithubFlowNode,
  contextManager: ExecutionContextManager,
  userId: string,
) {
  contextManager.startNode(node.id);

  const started = performance.now();

  const context = contextManager.getContext();

  executionEvents.emit({
    executionId: context.executionId,
    nodeType: "tool",
    type: "node:start",
    nodeId: node.id,
    nodeName: context.nodeNames[node.id],
    timestamp: Date.now(),
  });

  try {
    const config = node.data.config;

    if (!config.connectionId) {
      throw new Error("Github is not connected.");
    }

    const connection = await getGithubConnection(userId, config.connectionId);

    contextManager.setOutput(node.id, {
      type: "github",
      value: {
        connectionId: node.data.config.connectionId,
        repository: node.data.config.repository,
        operations: node.data.config.operations,
      },
    });

    contextManager.finishNode(node.id);

    executionEvents.emit({
      executionId: context.executionId,
      nodeType: "agent",
      type: "node:success",
      nodeId: node.id,
      timestamp: Date.now(),
      nodeName: context.nodeNames[node.id],
      duration: performance.now() - started,
    });
  } catch (error) {
    contextManager.failNode(node.id);

    executionEvents.emit({
      executionId: context.executionId,
      nodeType: "agent",
      type: "node:error",
      nodeId: node.id,
      nodeName: context.nodeNames[node.id],
      error: error instanceof Error ? error : new Error(String(error)),
      timestamp: Date.now(),
      duration: performance.now() - started,
    });
    throw error;
  }
}
