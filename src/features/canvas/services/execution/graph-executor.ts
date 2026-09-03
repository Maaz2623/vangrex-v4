import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { getNextExecutionNodes } from "../graph/get-next-execution-nodes";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { nodeExecutorRegistry } from "./node-executor-registry";
import { ExecutionRuntime } from "./execution-runtime";
import { NodeStatusType } from "../../components/nodes/types";
import { ExecutionOutput } from "./execution-output";

type PublishNodeOutput = (data: {
  executionId: string;
  nodeId: string;
  output: ExecutionOutput;
}) => Promise<unknown>;

type PublishNodeStatus = (data: {
  executionId: string;
  nodeId: string;
  status: NodeStatusType;
}) => Promise<unknown>;

export class GraphExecutor {
  constructor(
    private readonly runtime: ExecutionRuntime,
    private readonly publishNodeStatus: PublishNodeStatus,
    private readonly publishNodeOutput: PublishNodeOutput,
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

    await this.publishNodeStatus({
      executionId: context.executionId,
      nodeId: node.id,
      status: "running",
    });

    try {
      console.log("[graph] EXECUTOR START:", {
        nodeId: node.id,
        nodeType: node.type,
      });

      await this.runtime.runStep(`node-${node.id}`, () =>
        executor(node, nodes, edges, context, userId),
      );

      console.log("[graph] EXECUTOR FINISHED:", {
        nodeId: node.id,
        nodeType: node.type,
      });

      context.nodeStates[node.id] = {
        ...context.nodeStates[node.id],
        nodeId: node.id,
        status: "success",
      };

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

      console.log("[graph] PUBLISHING SUCCESS:", {
        nodeId: node.id,
        nodeType: node.type,
      });
      await this.publishNodeStatus({
        executionId: context.executionId,
        nodeId: node.id,
        status: "success",
      });

      console.log("[graph] PUBLISHING SUCCESS:", {
        nodeId: node.id,
        nodeType: node.type,
      });
    } catch (error) {
      context.nodeStates[node.id] = {
        ...context.nodeStates[node.id],
        nodeId: node.id,
        status: "error",
      };

      await this.publishNodeStatus({
        executionId: context.executionId,
        nodeId: node.id,
        status: "error",
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
