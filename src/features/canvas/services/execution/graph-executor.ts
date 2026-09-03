import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { getNextExecutionNodes } from "../graph/get-next-execution-nodes";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { nodeExecutorRegistry } from "./node-executor-registry";
import { ExecutionRuntime } from "./execution-runtime";
import { NodeStatusType } from "../../components/nodes/types";

type PublishNodeStatus = (
  id: string,
  data: {
    executionId: string;
    nodeId: string;
    status: NodeStatusType
  },
) => Promise<unknown>;

export class GraphExecutor {
  constructor(
    private readonly runtime: ExecutionRuntime,
    private readonly publishNodeStatus: PublishNodeStatus,
  ) {}

  async execute(
    startNode: AppFlowNode,
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    context: ExecutionContext,
    userId: string,
  ) {
    const contextManager = new ExecutionContextManager(context);
    await this.executeNode(startNode, nodes, edges, context, userId);
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

    if (!context.executionId) {
      throw new Error("Execution Id is required");
    }

    context.nodeStates[node.id] = {
      ...context.nodeStates[node.id],
      nodeId: node.id,
      status: "running",
    };

    await this.publishNodeStatus(`node-${node.id}-running`, {
      executionId: context.executionId,
      nodeId: node.id,
      status: "running",
    });

    try {
      await this.runtime.runStep(`node-${node.id}`, () =>
        executor(node, nodes, edges, context, userId),
      );

      context.nodeStates[node.id] = {
        ...context.nodeStates[node.id],
        nodeId: node.id,
        status: "success",
      };

      await this.publishNodeStatus(`node-${node.id}-success`, {
        executionId: context.executionId,
        nodeId: node.id,
        status: "success",
      });
    } catch (error) {
      context.nodeStates[node.id] = {
        ...context.nodeStates[node.id],
        nodeId: node.id,
        status: "error",
      };

      await this.publishNodeStatus(`node-${node.id}-error`, {
        executionId: context.executionId,
        nodeId: node.id,
        status: "error",
      });

      throw error;
    }

    const nextNodes = getNextExecutionNodes(node.id, nodes, edges);

    for (const nextNode of nextNodes) {
      await this.executeNode(nextNode, nodes, edges, context, userId);
    }
  }
}
