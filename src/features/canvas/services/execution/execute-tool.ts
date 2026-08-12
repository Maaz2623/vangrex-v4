
import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { executionEvents } from "./execution-events";

export async function executeTool(
  toolNode: ToolFlowNode,
  context: ExecutionContext,
  execute: () => Promise<unknown>,
) {
  const started = performance.now();

  const contextManager = new ExecutionContextManager(context);

  contextManager.incrementNodesExecuted();
  contextManager.incrementToolsExecuted();

  executionEvents.emit({
    executionId: context.executionId,
    nodeType: "tool",
    type: "node:start",
    nodeId: toolNode.id,
    nodeName: context.nodeNames[toolNode.id],
    timestamp: Date.now(),
  });

  const duration = performance.now() - started;
  try {
    const result = await execute();

    context.outputs[toolNode.id] = {
      type: "tool",
      value: result,
    };

    executionEvents.emit({
      executionId: context.executionId,
      nodeType: "tool",
      type: "node:success",
      duration: duration,
      nodeId: toolNode.id,
      nodeName: context.nodeNames[toolNode.id],
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    contextManager.incrementErrors();

    executionEvents.emit({
      executionId: context.executionId,
      nodeType: "tool",
      type: "node:error",
      duration: duration,
      nodeId: toolNode.id,
      nodeName: context.nodeNames[toolNode.id],
      error: error instanceof Error ? error : new Error(String(error)),
      timestamp: Date.now(),
    });

    throw error;
  }
}
