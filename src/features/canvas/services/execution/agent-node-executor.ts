import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { AgentFlowNode } from "../../components/nodes/types";
import { executeAgent } from "./agent-executor";
import { ExecutionContext } from "./execution-context";
import { NodeExecutor } from "./node-executor";

export class AgentNodeExecutor implements NodeExecutor<AgentFlowNode> {
  execute(
    node: AgentFlowNode,
    nodes: AppFlowNode[],
    edges: FlowEdge[],
    context: ExecutionContext,
  ): Promise<void> {
    return executeAgent(node, nodes, edges, context);
  }
}
