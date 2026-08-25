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

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    triggers: [workflowRun],
  },

  async ({ event, step }) => {
    const { workflowId, executionId, startNodeId, nodes, edges, input } =
      event.data;

    const execution = await getExecution(executionId);

    const sandboxId = await step.run("get-or-create-sandbox", async () => {
      const execution = await getExecution(executionId);

      if (execution?.sandboxId) {
        console.log("[sandbox] existing:", execution.sandboxId);

        return execution.sandboxId;
      }

      const sandbox = await sandboxManager.create();

      await setExecutionSandbox(executionId, sandbox.id);

      console.log("[sandbox] created:", sandbox.id);

      return sandbox.id;
    });

    const sandbox = await sandboxManager.get(sandboxId);

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

    try {
      await graph.execute(startNode, nodes, edges, context);

      await completeExecution(executionId, {
        output: context.outputs,
      });

      return {
        executionId,
        sandboxId: sandbox.id,
        status: "completed",
      };
    } catch (error) {
      await failExecution(executionId, error);

      throw error;
    }
  },
);
