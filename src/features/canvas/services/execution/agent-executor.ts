import { generateText } from "ai";

import { delay } from "@/lib/delay";

import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { AgentFlowNode } from "../../components/nodes/types";

import { getConnectedTools } from "../graph/tool-resolver";
import { getConnectingEdge } from "../graph/get-connecting-edge";

import { createTools } from "./tool-factory";
import { defaultModel } from "./model";
import { executionEvents } from "./execution-events";
import { interpolatePrompt } from "./prompt-interpolator";
import { ExecutionContextManager } from "./execution-context-manager";

export async function executeAgent(
  agent: AgentFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  contextManager: ExecutionContextManager,
) {
  const context = contextManager.getContext();

  contextManager.startNode(agent.id);
  contextManager.recordAgentExecution();

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

  const edge =
    connectedTools.length > 0
      ? getConnectingEdge(agent.id, connectedTools[0].id, edges)
      : undefined;

  if (edge) {
    executionEvents.emit({
      type: "edge:start",
      edgeId: edge.id,
      timestamp: Date.now(),
    });

    await delay(500);
  }

  try {
    console.log("AGENT VARIABLES:", context.variables);
    const prompt = interpolatePrompt(agent.data.config.prompt, context);
    console.log("FINAL AGENT PROMPT:", prompt);

    const result = await generateText({
      model: defaultModel,
      prompt,
      tools,
      stopWhen: ({ steps }) => steps.length >= 2,
      instructions: "You are a helpful assistant",
    });

    contextManager.setOutput(agent.id, {
      type: "agent",
      text: result.text,
    });

    if (edge) {
      await delay(500);

      executionEvents.emit({
        type: "edge:success",
        edgeId: edge.id,
        timestamp: Date.now(),
      });
    }

    await delay(1000);

    contextManager.finishNode(agent.id);

    executionEvents.emit({
      type: "node:success",
      nodeId: agent.id,
      timestamp: Date.now(),
      nodeName: context.nodeNames[agent.id],
      duration: performance.now() - started,
    });
  } catch (error) {
    contextManager.incrementErrors();
    contextManager.failNode(agent.id);

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
      nodeName: context.nodeNames[agent.id],
      error: error instanceof Error ? error : new Error(String(error)),
      timestamp: Date.now(),
      duration: performance.now() - started,
    });

    throw error;
  }
}
