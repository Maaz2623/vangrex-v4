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

  const duration = performance.now() - started;
  try {
    const result = await execute();

    context.outputs[toolNode.id] = {
      type: "tool",
      value: result,
    };

    return result;
  } catch (error) {
    contextManager.incrementErrors();

    throw error;
  }
}
