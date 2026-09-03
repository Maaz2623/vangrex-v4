import { logger, task } from "@trigger.dev/sdk";

import { AppFlowNode } from "@/features/canvas/components/nodes/node-config";
import { FlowEdge } from "@/features/canvas/components/edges/types/base-edge";
import { NodeStatusType } from "@/features/canvas/components/nodes/types";

import { ExecutionContext } from "@/features/canvas/services/execution/execution-context";
import { GraphExecutor } from "@/features/canvas/services/execution/graph-executor";
import { ExecutionOutput } from "@/features/canvas/services/execution/execution-output";

import {
  completeExecution,
  failExecution,
  getExecution,
} from "@/features/canvas/services/execution/execution-persistance";

import { TriggerExecutionRuntime } from "./trigger-execution-runtime";
import { nodeOutputStream, nodeStatusStream } from "./streams";

export type ExecuteWorkflowPayload = {
  workflowId: string;
  executionId: string;
  startNodeId: string;
  nodes: AppFlowNode[];
  edges: FlowEdge[];
  input: unknown;
  userId: string;
};

export const executeWorkflowTask = task({
  id: "execute-workflow",

  maxDuration: 3600,

  run: async (payload: ExecuteWorkflowPayload, { ctx }) => {
    const {
      workflowId,
      executionId,
      startNodeId,
      nodes,
      edges,
      input,
      userId,
    } = payload;

    logger.log("Vangrex workflow started", {
      executionId,
      runId: ctx.run.id,
    });

    const publishNodeStatus = async (data: {
      executionId: string;
      nodeId: string;
      status: NodeStatusType;
    }) => {
      logger.log("Publishing node status", data);

      await nodeStatusStream.append(data);

      logger.log("Node status published", data);

      return data;
    };

    const publishNodeOutput = async (data: {
      executionId: string;
      nodeId: string;
      output: ExecutionOutput;
    }) => {
      logger.log("Publishing node output", data);

      await nodeOutputStream.append(data);

      logger.log("Node output published", data);

      return data;
    };

    const execution = await getExecution(executionId);

    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    const context: ExecutionContext = {
      executionId,
      workflowId,

      startedAt: Date.now(),

      nodeNames: Object.fromEntries(
        nodes.map((node) => [node.id, node.data.title]),
      ),

      outputs: {},

      variables: {},

      artifacts: [],

      metadata: {
        input: input ?? null,
      },

      nodeStates: Object.fromEntries(
        nodes.map((node) => [
          node.id,
          {
            nodeId: node.id,
            status: "idle",
          },
        ]),
      ),

      stats: {
        nodesExecuted: 0,
        agentsExecuted: 0,
        toolsExecuted: 0,
        errors: 0,
        startedAt: Date.now(),
      },
    };

    const startNode = nodes.find((node) => node.id === startNodeId);

    if (!startNode) {
      throw new Error(`Start node ${startNodeId} not found`);
    }

    const runtime = new TriggerExecutionRuntime();

    const graph = new GraphExecutor(
      runtime,
      publishNodeStatus,
      publishNodeOutput,
    );

    try {
      await graph.execute(startNode, nodes, edges, context, userId);

      await completeExecution(executionId, {
        output: context.outputs,
      });

      return {
        executionId,
        status: "completed",
      };
    } catch (error) {
      await failExecution(executionId, error);

      throw error;
    }
  },
});
