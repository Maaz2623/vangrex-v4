import { sandboxManager } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { useExecutionStore } from "../../store/execution-store";
import { workspaceManager } from "../workspace/workspace-manager";
import { ExecutionContext } from "./execution-context";
import { getStartNodes } from "./get-start-nodes";
import { GraphExecutor } from "./graph-executor";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { tasks, logger, streams } from "@trigger.dev/sdk";
import { executeWorkflowTask } from "@/trigger/execute-workflow";

export class ExecutionManager {
  async execute(
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    options?: {
      workflowId?: string;
      input?: unknown;
      executionId?: string;
    },
  ) {
    useExecutionStore.getState().clear();

    const context: ExecutionContext = {
      executionId: options?.executionId,
      workflowId: options?.workflowId ?? "manual",
      startedAt: Date.now(),

      nodeNames: Object.fromEntries(
        nodes.map((node) => [node.id, node.data.title]),
      ),

      outputs: {},
      variables: {},

      artifacts: [],

      metadata: {
        input: options?.input ?? null,
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

    const startNodes = getStartNodes(nodes, edges);

    if (startNodes.length === 0) {
      throw new Error("No start node found.");
    }

    const executionId = options?.executionId;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Unauthorized: no authenticated user.");
    }

    console.log("[perf] before inngest.send", Date.now());

    const handle = await executeWorkflowTask.trigger({
      workflowId: options?.workflowId ?? "manual",
      executionId: executionId!,
      nodes,
      edges,
      startNodeId: startNodes[0].id,
      input: options?.input ?? null,
      userId: session.user.id,
    });
    console.log("[perf] after inngest.send", Date.now());

    return {
      executionId,
      runId: handle.id,
    };
  }
}
