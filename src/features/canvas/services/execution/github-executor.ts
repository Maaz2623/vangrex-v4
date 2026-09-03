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

  } catch (error) {
    contextManager.failNode(node.id);

    throw error;
  }
}
