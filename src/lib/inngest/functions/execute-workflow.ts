import { AppFlowNode } from "@/features/canvas/components/nodes/node-config";
import { inngest, workflowRun } from "../client";
import { InngestExecutionRuntime } from "../inngest-execution-runtime";
import { FlowEdge } from "@/features/canvas/components/edges/types/base-edge";
import { sandboxManager } from "@/lib/sandbox/sandbox-manager";
import { ExecutionContext } from "@/features/canvas/services/execution/execution-context";
import { GraphExecutor } from "@/features/canvas/services/execution/graph-executor";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    triggers: [workflowRun],
  },

  async ({ event, step }) => {
    const { workflowId, executionId, startNodeId, nodes, edges, input } =
      event.data;

    const sandbox = await sandboxManager.create();

    console.log("[sandbox]: ", sandbox.id);

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
            status: "pending",
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

    const graph = new GraphExecutor(sandbox, runtime);

    const startNode = nodes.find((node) => node.id === startNodeId);

    if (!startNode) {
      throw new Error(`Start node ${startNodeId} not found`);
    }

    await graph.execute(startNode, nodes, edges, context);

    return {
      executionId,
      sandboxId: sandbox.id,
      status: "completed",
    };
  },
);
