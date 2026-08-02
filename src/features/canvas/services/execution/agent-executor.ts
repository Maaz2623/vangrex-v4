import { streamText, generateText } from "ai";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { getConnectedTools } from "../graph/tool-resolver";
import { createTools } from "./tool-factory";
import { defaultModel } from "./model";
import { AgentFlowNode } from "../../components/nodes/types";

export async function executeAgent(
  agent: AgentFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
) {
  if (!agent) {
    throw new Error("Agent not found");
  }

  const connectedTools = getConnectedTools(agent.id, nodes, edges);

  const tools = createTools(connectedTools);

  try {
    const result = generateText({
      model: defaultModel,
      prompt: agent.data.config.prompt,
      tools,
    });

    const text = (await result).content;

    console.log(text);
  } catch (error) {
    console.log(error);
  }
}
