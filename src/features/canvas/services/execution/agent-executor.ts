import { generateText } from "ai";
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
import { getNextExecutionNodes } from "../graph/get-next-execution-nodes";
import { interpolatePrompt } from "./prompt-interpolator";

export async function executeAgent(
  agent: AgentFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  context: ExecutionContext,
) {
  if (!agent) {
    throw new Error("Agent not found");
  }

  const started = performance.now();

  executionEvents.emit({
    type: "node:start",
    nodeId: agent.id,
    timestamp: Date.now(),
    nodeName: context.nodeNames[agent.id],
  });

  await delay(1000);

  const connectedTools = getConnectedTools(agent.id, nodes, edges);
  const tools = createTools(connectedTools, context);

  console.log(
    "Next execution nodes: ",
    getNextExecutionNodes(agent.id, nodes, edges),
  );

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
    const prompt = interpolatePrompt(agent.data.config.prompt, context);

    const result = await generateText({
      model: defaultModel,
      prompt: prompt,
      tools,
      stopWhen: ({ steps }) => {
        return steps.length >= 2;
      },
      instructions: "Always reply in a sentence",
    });

    context.outputs[agent.id] = {
      type: "agent",
      text: result.text,
    };

    if (edge) {
      await delay(500);

      executionEvents.emit({
        type: "edge:success",
        edgeId: edge.id,
        timestamp: Date.now(),
      });
    }

    await delay(1000);

    const duration = performance.now() - started;

    executionEvents.emit({
      type: "node:success",
      nodeId: agent.id,
      timestamp: Date.now(),
      nodeName: context.nodeNames[agent.id],
      duration,
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

    const duration = performance.now() - started;

    executionEvents.emit({
      type: "node:error",
      nodeId: agent.id,
      error: error instanceof Error ? error : new Error(String(error)),
      timestamp: Date.now(),
      nodeName: context.nodeNames[agent.id],
      duration,
    });

    throw error;
  }
}
