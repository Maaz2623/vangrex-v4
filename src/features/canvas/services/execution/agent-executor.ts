import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { getConnectedTools } from "../graph/tool-resolver";
import { createTools } from "./tool-factory";

export async function executeAgent(
  agentId: string,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
) {
  const agent = nodes.find(
    (node) => node.id === agentId && node.type === "agent",
  );

  if (!agent) {
    throw new Error("Agent not found");
  }

  const connectedTools = getConnectedTools(agentId, nodes, edges);

  const tools = createTools(connectedTools);

  console.log("Agent:", agent);
  console.log("Connected tools:", connectedTools);
  console.log("SDK tools:", tools);
}
