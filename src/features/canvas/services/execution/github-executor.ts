import { GithubFlowNode } from "../../components/nodes/types";
import { ExecutionContextManager } from "./execution-context-manager";

export async function executeGithub(
  node: GithubFlowNode,
  contextManager: ExecutionContextManager,
) {
  contextManager.startNode(node.id);

  contextManager.setOutput(node.id, {
    type: "github",
    value: {
      connectionId: node.data.config.connectionId,
      repository: node.data.config.repository,
      operations: node.data.config.operations,
    },
  });

  contextManager.finishNode(node.id);
}
