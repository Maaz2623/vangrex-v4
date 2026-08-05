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
    type: "tool:start",
    nodeId: toolNode.id,
    nodeName: context.nodeNames[toolNode.id],
    timestamp: Date.now(),
  });

  try {
    const result = await execute();

    const duration = performance.now() - started;

    context.outputs[toolNode.id] = {
      type: "tool",
      value: result,
    };

    executionEvents.emit({
      type: "tool:success",
      nodeId: toolNode.id,
      nodeName: context.nodeNames[toolNode.id],
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    contextManager.incrementErrors();

    executionEvents.emit({
      type: "tool:error",
      nodeId: toolNode.id,
      nodeName: context.nodeNames[toolNode.id],
      error: error instanceof Error ? error : new Error(String(error)),
      timestamp: Date.now(),
    });

    throw error;
  }
}
