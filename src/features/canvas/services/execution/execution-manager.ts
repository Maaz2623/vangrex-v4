import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { AgentFlowNode } from "../../components/nodes/types";
import { executeAgent } from "./agent-executor";
import { ExecutionContext } from "./execution-context";
import { GraphExecutor } from "./graph-executor";

export class ExecutionManager {
  async execute(nodes: AppFlowNode[], edges: FlowEdge[]) {
    const context: ExecutionContext = {
      workflowId: "temp",
      startedAt: Date.now(),

      nodeNames: Object.fromEntries(
        nodes.map((node) => [node.id, node.data.title]),
      ),

      outputs: {},
    };

    const startAgent = nodes.find(
      (node): node is AgentFlowNode => node.type === "agent",
    );

    if (!startAgent) {
      throw new Error("No start agent found");
    }

    const graph = new GraphExecutor();

    await graph.execute(startAgent, nodes, edges, context);
  }
}
