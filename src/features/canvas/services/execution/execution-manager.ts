import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { AgentFlowNode } from "../../components/nodes/types";
import { useExecutionStore } from "../../store/execution-store";
import { executeAgent } from "./agent-executor";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { getStartNodes } from "./get-start-nodes";
import { GraphExecutor } from "./graph-executor";

export class ExecutionManager {
  async execute(nodes: AppFlowNode[], edges: FlowEdge[]) {
    useExecutionStore.getState().clear();
    const context: ExecutionContext = {
      workflowId: "temp",
      startedAt: Date.now(),

      nodeNames: Object.fromEntries(
        nodes.map((node) => [node.id, node.data.title]),
      ),

      outputs: {},

      variables: {},

      artifacts: [],

      metadata: {},

      executionId: crypto.randomUUID(),

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

    const graph = new GraphExecutor();

    const startNodes = getStartNodes(nodes, edges);

    if (startNodes.length === 0) {
      throw new Error("No start nodes found");
    }

    for (const startNode of startNodes) {
      await graph.execute(startNode, nodes, edges, context);
    }
  }
}
