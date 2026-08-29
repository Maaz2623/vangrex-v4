import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";
import { GithubFlowNode } from "../../components/nodes/types";
import { ExecutionContextManager } from "./execution-context-manager";
import { getGithubConnection } from "@/features/github/services/github-connection-service";

export async function executeGithub(
  node: GithubFlowNode,
  contextManager: ExecutionContextManager,
  sandbox: SandboxInstance,
  userId: string,
) {
  contextManager.startNode(node.id);

  try {
    const config = node.data.config;

    if (!config.connectionId) {
      throw new Error("Github is not connected.");
    }

    const connection = await getGithubConnection(userId, config.connectionId);



    console.log("[github] connected: ", connection.githubUsername);

    console.log(
      Object.getOwnPropertyNames(Object.getPrototypeOf(sandbox.sandbox)),
    );

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
