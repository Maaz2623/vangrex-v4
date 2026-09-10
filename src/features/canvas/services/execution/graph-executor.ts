import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { getNextExecutionNodes } from "../graph/get-next-execution-nodes";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { nodeExecutorRegistry } from "./node-executor-registry";
import { ExecutionRuntime } from "./execution-runtime";
import { NodeStatusType } from "../../components/nodes/types";
import { ExecutionOutput } from "./execution-output";

export type PublishNodeOutput = (data: {
  executionId: string;
  nodeId: string;
  output: ExecutionOutput;
}) => Promise<unknown>;

export type PublishNodeStatus = (data: {
  executionId: string;
  nodeId: string;
  status: NodeStatusType;
}) => Promise<unknown>;

export type PersistNodeStatus = (data: {
  executionId: string;
  nodeId: string;
  status: NodeStatusType;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  error?: string | null;
}) => Promise<unknown>;

export class GraphExecutor {
  constructor(
    private readonly runtime: ExecutionRuntime,
    private readonly publishNodeStatus: PublishNodeStatus,
    private readonly publishNodeOutput: PublishNodeOutput,
    private readonly persistNodeStatus: PersistNodeStatus,
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

    const nodeStartedAt = new Date();

    context.nodeStates[node.id] = {
      ...context.nodeStates[node.id],
      nodeId: node.id,
      status: "running",
    };

    await this.persistNodeStatus({
      executionId: context.executionId,
      nodeId: node.id,
      status: "running",
      startedAt: nodeStartedAt,
    });

    try {
      await this.runtime.runStep(`node-${node.id}`, () =>
        executor(node, nodes, edges, context, userId, this.publishNodeStatus),
      );

      context.nodeStates[node.id] = {
        ...context.nodeStates[node.id],
        nodeId: node.id,
        status: "success",
      };

      const completedAt = new Date();

      await this.persistNodeStatus({
        executionId: context.executionId,
        nodeId: node.id,
        status: "success",
        completedAt,
        duration: completedAt.getTime() - nodeStartedAt.getTime(),
      });

      if (node.type !== "output") {
        const output = context.outputs[node.id];

        if (output) {
          await this.publishNodeOutput({
            executionId: context.executionId,
            nodeId: node.id,
            output,
          });
        }
      }
    } catch (error) {
      context.nodeStates[node.id] = {
        ...context.nodeStates[node.id],
        nodeId: node.id,
        status: "error",
      };

      const completedAt = new Date();

      const message = error instanceof Error ? error.message : String(error);

      await this.persistNodeStatus({
        executionId: context.executionId,
        nodeId: node.id,
        status: "error",
        completedAt,
        duration: completedAt.getTime() - nodeStartedAt.getTime(),
        error: message,
      });

      throw error;
    }

    const nextNodes = getNextExecutionNodes(node.id, nodes, edges);

    await Promise.all(
      nextNodes.map((nextNode) =>
        this.executeNode(nextNode, nodes, edges, context, userId),
      ),
    );
  }
}
