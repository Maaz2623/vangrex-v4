import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { AgentFlowNode } from "../../components/nodes/types";
import { getNextExecutionNodes } from "../graph/get-next-execution-nodes";
import { Workspace } from "../workspace/workspace-manager";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { nodeExecutorRegistry } from "./node-executor-registry";
import { ExecutionRuntime } from "./execution-runtime";

export class GraphExecutor {
  constructor(
    private readonly sandbox: SandboxInstance,
    private readonly runtime: ExecutionRuntime,
  ) {}

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
      this.sandbox,
      userId,
    );
    contextManager.finishExecution();
  }

  private async executeNode(
    node: AppFlowNode,
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    context: ExecutionContext,
    sandbox: SandboxInstance,
    userId: string,
  ) {
    const executor = nodeExecutorRegistry[node.type];

    if (!executor) {
      throw new Error(`No executor registered for node: ${node.type}`);
    }

    await this.runtime.runStep(`node-${node.id}`, () =>
      executor(node, nodes, edges, context, sandbox, userId),
    );

    const nextNodes = getNextExecutionNodes(node.id, nodes, edges);

    for (const nextNode of nextNodes) {
      await this.executeNode(nextNode, nodes, edges, context, sandbox, userId);
    }
  }
}
