import { streamText, generateText } from "ai";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { getConnectedTools } from "../graph/tool-resolver";
import { createTools } from "./tool-factory";
import { defaultModel } from "./model";
import { AgentFlowNode } from "../../components/nodes/types";
import { executionEvents } from "./execution-events";
import { delay } from "@/lib/delay";
import { getConnectingEdge } from "../graph/get-connecting-edge";
import { ExecutionContext } from "./execution-context";

export async function executeAgent(
  agent: AgentFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
) {
  if (!agent) {
    throw new Error("Agent not found");
  }

  const context: ExecutionContext = {
    workflowId: "temp",
    startedAt: Date.now(),

    nodeNames: Object.fromEntries(
      nodes.map((node) => [node.id, node.data.title]),
    ),
  };

  executionEvents.emit({
    type: "node:start",
    nodeId: agent.id,
    timestamp: Date.now(),
    nodeName: context.nodeNames[agent.id],
  });

  await delay(1000);

  const connectedTools = getConnectedTools(agent.id, nodes, edges);
  const tools = createTools(connectedTools, context);

  console.log("Connected tools:", connectedTools);
  console.log("Edges:", edges);

  const edge =
    connectedTools.length > 0
      ? getConnectingEdge(agent.id, connectedTools[0].id, edges)
      : undefined;

  console.log("Edge found:", edge);

  if (edge) {
    console.log("EMITTING EDGE START");
    executionEvents.emit({
      type: "edge:start",
      edgeId: edge.id,
      timestamp: Date.now(),
    });

    await delay(500);
  }

  try {
    const result = await generateText({
      model: defaultModel,
      prompt: agent.data.config.prompt,
      tools,
    });

    console.log(result.content);

    if (edge) {
      await delay(500);

      executionEvents.emit({
        type: "edge:success",
        edgeId: edge.id,
        timestamp: Date.now(),
      });
    }

    await delay(1000);

    executionEvents.emit({
      type: "node:success",
      nodeId: agent.id,
      timestamp: Date.now(),
      nodeName: context.nodeNames[agent.id],
    });
  } catch (error) {
    if (edge) {
      executionEvents.emit({
        type: "edge:error",
        edgeId: edge.id,
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: Date.now(),
      });
    }

    executionEvents.emit({
      type: "node:error",
      nodeId: agent.id,
      error: error instanceof Error ? error : new Error(String(error)),
      timestamp: Date.now(),
      nodeName: context.nodeNames[agent.id],
    });

    throw error;
  }
}
