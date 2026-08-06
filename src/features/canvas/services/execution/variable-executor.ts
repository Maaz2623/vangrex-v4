import { VariableFlowNode } from "../../components/nodes/types/variable-node";
import { ExecutionContextManager } from "./execution-context-manager";
import { executionEvents } from "./execution-events";

export async function executeVariable(
  node: VariableFlowNode,
  context: ExecutionContextManager,
) {
  executionEvents.emit({
    type: "node:start",
    nodeId: node.id,
    timestamp: Date.now(),
    nodeName: node.data.title,
  });

  context.incrementNodesExecuted()

  context.setVariable(
    node.data.config.name,
    node.data.config.value
  )


  executionEvents.emit({
    type: "node:success",
    nodeId: node.id,
    timestamp: Date.now(),
    nodeName: node.data.title,
    duration: 0
  })

}
