import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { AgentFlowNode } from "../../components/nodes/types";
import { getNextExecutionNodes } from "../graph/get-next-execution-nodes";
import { executeAgent } from "./agent-executor";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { nodeExecutorRegistry } from "./node-executor-registry";

export class GraphExecutor {
  async execute(
    startNode: AppFlowNode,
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    context: ExecutionContext,
  ) {
    const contextManager = new ExecutionContextManager(context);
    await this.executeNode(startNode, nodes, edges, context);
    contextManager.finishExecution();
  }

  private async executeNode(
    node: AppFlowNode,
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    context: ExecutionContext,
  ) {
    const executor = nodeExecutorRegistry[node.type];

    if (!executor) {
      throw new Error(`No executor registered for node: ${node.type}`);
    }

    await executor(node, nodes, edges, context);

    const nextNodes = getNextExecutionNodes(node.id, nodes, edges);

    for (const nextNode of nextNodes) {
      await this.executeNode(nextNode, nodes, edges, context);
    }
  }
}
