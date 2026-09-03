import { VariableFlowNode } from "../../components/nodes/types";
import { ExecutionContextManager } from "./execution-context-manager";
import { executionEvents } from "./execution-events";

export async function executeVariable(
  node: VariableFlowNode,
  context: ExecutionContextManager,
) {

  context.incrementNodesExecuted();

  context.setVariable(node.data.config.name, node.data.config.value);

}
