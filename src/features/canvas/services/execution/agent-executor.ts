import { streamText, generateText } from "ai";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { getConnectedTools } from "../graph/tool-resolver";
import { createTools } from "./tool-factory";
import { defaultModel } from "./model";
import { AgentFlowNode } from "../../components/nodes/types";
import { executionEvents } from "./execution-events";
import { delay } from "@/lib/delay";

export async function executeAgent(
  agent: AgentFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
) {
  if (!agent) {
    throw new Error("Agent not found");
  }

  executionEvents.emit({
    type: "node:start",
    nodeId: agent.id,
  });

  await delay(3000);

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

    await delay(3000);

    executionEvents.emit({
      type: "node:success",
      nodeId: agent.id,
    });
  } catch (error) {
    executionEvents.emit({
      type: "node:error",
      nodeId: agent.id,
      error: error instanceof Error ? error : new Error(String(error)),
    });

    console.log(error);
  }
}
