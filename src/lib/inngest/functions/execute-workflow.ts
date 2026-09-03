import { AppFlowNode } from "@/features/canvas/components/nodes/node-config";
import { inngest, workflowRun } from "../client";
import { InngestExecutionRuntime } from "../inngest-execution-runtime";
import { FlowEdge } from "@/features/canvas/components/edges/types/base-edge";
import { SandboxInstance, sandboxManager } from "@/lib/sandbox/sandbox-manager";
import { ExecutionContext } from "@/features/canvas/services/execution/execution-context";
import { GraphExecutor } from "@/features/canvas/services/execution/graph-executor";
import {
  completeExecution,
  failExecution,
  getExecution,
  setExecutionSandbox,
} from "@/features/canvas/services/execution/execution-persistance";
import { workflowChannel } from "../channels";
import { NodeStatusType } from "@/features/canvas/components/nodes/types";
import { ExecutionOutput } from "@/features/canvas/services/execution/execution-output";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    triggers: [workflowRun],
  },
  async ({ event, step }) => {
    const {
      workflowId,
      executionId,
      startNodeId,
      nodes,
      edges,
      input,
      userId,
    } = event.data;

    const channel = workflowChannel({
      executionId,
    });

    const publishNodeStatus = (data: {
      executionId: string;
      nodeId: string;
      status: NodeStatusType;
    }) => {
      return inngest.realtime.publish(channel.nodeStatus, data);
    };

    const publishNodeOutput = (data: {
      executionId: string;
      nodeId: string;
      output: ExecutionOutput;
    }) => {
      return inngest.realtime.publish(channel.nodeOutput, data);
    };

    const execution = await getExecution(executionId);

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

    const runtime = new InngestExecutionRuntime(step);

    // We'll change GraphExecutor next.
    const graph = new GraphExecutor(runtime, publishNodeStatus, publishNodeOutput);

    const startNode = nodes.find((node) => node.id === startNodeId);

    if (!startNode) {
      throw new Error(`Start node ${startNodeId} not found`);
    }

    try {
      await graph.execute(startNode, nodes, edges, context, userId);

      await completeExecution(executionId, {
        output: context.outputs,
      });

      const outputNode = nodes.find((node) => node.type === "output");

      const output = outputNode ? context.outputs[outputNode.id] : undefined;

      return {
        executionId,
        status: "completed",
      };
    } catch (error) {
      await failExecution(executionId, error);
      throw error;
    }
  },
);
