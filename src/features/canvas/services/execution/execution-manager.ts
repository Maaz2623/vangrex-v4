import { useExecutionStore } from "../../store/execution-store";

import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";

import { ExecutionContext } from "./execution-context";
import { getStartNodes } from "./get-start-nodes";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

    const input =
      options?.input &&
      typeof options.input === "object" &&
      !Array.isArray(options.input)
        ? (options.input as Record<string, unknown>)
        : {};

    const context: ExecutionContext = {
      input,

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
        input,
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

    console.log("[perf] before trigger", Date.now());

    const handle = await executeWorkflowTask.trigger({
      workflowId: options?.workflowId ?? "manual",
      executionId: executionId!,
      nodes,
      edges,
      startNodeId: startNodes[0].id,
      input,
      userId: session.user.id,
    });

    console.log("[perf] after trigger", Date.now());

    return {
      executionId,
      runId: handle.id,
    };
  }
}
