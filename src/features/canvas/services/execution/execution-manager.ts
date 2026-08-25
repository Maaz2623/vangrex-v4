import { sandboxManager } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { useExecutionStore } from "../../store/execution-store";
import { workspaceManager } from "../workspace/workspace-manager";
import { ExecutionContext } from "./execution-context";
import { getStartNodes } from "./get-start-nodes";
import { GraphExecutor } from "./graph-executor";
import { LocalExecutionRuntime } from "./local-execution-runtime";
import { inngest } from "@/lib/inngest/client";

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

    // const sandbox = await sandboxManager.create();

    // console.log("[sandbox] created:", sandbox.id);

    // console.log("[sandbox] url: ", sandboxManager.getUrl(sandbox, 3000));

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

    // const runtime = new LocalExecutionRuntime();

    // const graph = new GraphExecutor(sandbox, runtime);

    const startNodes = getStartNodes(nodes, edges);

    if (startNodes.length === 0) {
      throw new Error("No start node found.");
    }

    // for (const startNode of startNodes) {
    //   await graph.execute(startNode, nodes, edges, context);
    // }

    const executionId = options?.executionId;

    await inngest.send({
      name: "workflow/run",
      data: {
        workflowId: options?.executionId ?? "manual",
        executionId,
        nodes,
        edges,
        startNodeId: startNodes[0].id,
        input: options?.input ?? null,
      },
    });

    return {
      executionId,
    };
  }
}
