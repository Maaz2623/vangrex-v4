import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { getNextExecutionNodes } from "../graph/get-next-execution-nodes";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { nodeExecutorRegistry } from "./node-executor-registry";
import { ExecutionRuntime } from "./execution-runtime";

export class GraphExecutor {
  constructor(private readonly runtime: ExecutionRuntime) {}

  async execute(
    startNode: AppFlowNode,
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    context: ExecutionContext,
    userId: string,
  ) {
    const contextManager = new ExecutionContextManager(context);
    await this.executeNode(
      startNode,
      nodes,
      edges,
      context,
      userId,
    );
    contextManager.finishExecution();
  }

  private async executeNode(
    node: AppFlowNode,
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    context: ExecutionContext,
    userId: string,
  ) {
    const executor = nodeExecutorRegistry[node.type];

    if (!executor) {
      throw new Error(`No executor registered for node: ${node.type}`);
    }

    await this.runtime.runStep(`node-${node.id}`, () =>
      executor(node, nodes, edges, context, userId),
    );

    const nextNodes = getNextExecutionNodes(node.id, nodes, edges);

    for (const nextNode of nextNodes) {
      await this.executeNode(nextNode, nodes, edges, context, userId);
    }
  }
}
