import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { PublishNodeStatus } from "./graph-executor";

export async function executeTool(
  toolNode: ToolFlowNode,
  context: ExecutionContext,
  execute: () => Promise<unknown>,
  publishNodeStatus: PublishNodeStatus,
) {
  const contextManager = new ExecutionContextManager(context);

  if (!context.executionId) {
    throw new Error("Execution ID is required");
  }

  contextManager.startNode(toolNode.id);
  contextManager.incrementNodesExecuted();
  contextManager.incrementToolsExecuted();

  await publishNodeStatus({
    executionId: context.executionId,
    nodeId: toolNode.id,
    status: "running",
  });

  try {
    const result = await execute();

    context.outputs[toolNode.id] = {
      type: "tool",
      value: result,
    };

    contextManager.finishNode(toolNode.id);

    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: toolNode.id,
      status: "success",
    });

    return result;
  } catch (error) {
    contextManager.incrementErrors();
    contextManager.failNode(toolNode.id);

    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: toolNode.id,
      status: "error",
    });

    throw error;
  }
}
