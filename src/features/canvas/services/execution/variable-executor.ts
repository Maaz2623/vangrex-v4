import { VariableFlowNode } from "../../components/nodes/types";
import { ExecutionContextManager } from "./execution-context-manager";
import { executionEvents } from "./execution-events";

export async function executeVariable(
  node: VariableFlowNode,
  context: ExecutionContextManager,
) {
  executionEvents.emit({
    type: "node:start",
    executionId: context.executionId,
    nodeId: node.id,
    nodeType: "variable",
    timestamp: Date.now(),
    nodeName: node.data.title,
  });

  context.incrementNodesExecuted();

  context.setVariable(node.data.config.name, node.data.config.value);

  executionEvents.emit({
    type: "node:success",
    executionId: context.executionId,
    nodeId: node.id,
    nodeType: "variable",
    timestamp: Date.now(),
    nodeName: node.data.title,
    duration: 0,
  });
}
