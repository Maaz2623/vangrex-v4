import { NodeStatusType } from "../../components/nodes/types";
import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { PublishNodeStatus } from "./graph-executor";

export type PersistNodeStatus = (data: {
  executionId: string;
  nodeId: string;
  status: NodeStatusType;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  error?: string | null;
}) => Promise<unknown>;

export async function executeTool(
  toolNode: ToolFlowNode,
  context: ExecutionContext,
  execute: () => Promise<unknown>,
  publishNodeStatus: PublishNodeStatus,
  persistNodeStatus: PersistNodeStatus,
) {
  const contextManager = new ExecutionContextManager(context);

  if (!context.executionId) {
    throw new Error("Execution ID is required");
  }

  const nodeStartedAt = new Date();

  await publishNodeStatus({
    executionId: context.executionId,
    nodeId: toolNode.id,
    status: "running",
  });

  contextManager.startNode(toolNode.id);
  contextManager.incrementNodesExecuted();
  contextManager.incrementToolsExecuted();

  try {
    const result = await execute();

    context.outputs[toolNode.id] = {
      type: "tool",
      value: result,
    };

    contextManager.finishNode(toolNode.id);
    const completedAt = new Date();

    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: toolNode.id,
      status: "success",
    });

    await persistNodeStatus({
      executionId: context.executionId,
      nodeId: toolNode.id,
      status: "success",
      completedAt,
      duration: completedAt.getTime() - nodeStartedAt.getTime(),
    });
    return result;
  } catch (error) {
    const completedAt = new Date();
    contextManager.incrementErrors();
    contextManager.failNode(toolNode.id);

    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: toolNode.id,
      status: "error",
    });

    await persistNodeStatus({
      executionId: context.executionId,
      nodeId: toolNode.id,
      status: "error",
      completedAt,
      duration: completedAt.getTime() - nodeStartedAt.getTime(),
    });

    throw error;
  }
}
