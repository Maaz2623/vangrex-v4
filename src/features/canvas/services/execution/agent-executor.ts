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
import { createWorkspaceTools } from "./tools/workspace-tools";
import { Workspace, workspaceManager } from "../workspace/workspace-manager";
import { saveAgentDebug } from "../../../../../agent-debug";
import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";

export async function executeAgent(
  agent: AgentFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  contextManager: ExecutionContextManager,
  sandbox: SandboxInstance,
) {
  const context = contextManager.getContext();

  contextManager.startNode(agent.id);
  contextManager.recordAgentExecution();

  const started = performance.now();

  executionEvents.emit({
    executionId: context.executionId,
    nodeType: "agent",
    type: "node:start",
    nodeId: agent.id,
    timestamp: Date.now(),
    nodeName: context.nodeNames[agent.id],
  });

  const connectedTools = getConnectedTools(agent.id, nodes, edges);

  const edge =
    connectedTools.length > 0
      ? getConnectingEdge(agent.id, connectedTools[0].id, edges)
      : undefined;

  // if (edge) {
  //   executionEvents.emit({
  //     type: "edge:start",
  //     edgeId: edge.id,
  //     timestamp: Date.now(),
  //   });

  //   await delay(500);
  // }

  try {
    const prompt = interpolatePrompt(agent.data.config.prompt, context);

    const tools = createTools(connectedTools, context, sandbox);

    const result = await generateText({
      model: defaultModel,
      prompt,
      tools,
      stopWhen: ({ steps }) => steps.length >= 50,
      instructions: "You are a helpful assistant",
    });
    

    await saveAgentDebug(context.executionId, result);

    contextManager.setOutput(agent.id, {
      type: "agent",
      text: result.text,
    });

    // if (edge) {
    //   await delay(500);

    //   executionEvents.emit({
    //     type: "edge:success",
    //     edgeId: edge.id,
    //     timestamp: Date.now(),
    //   });
    // }

    contextManager.finishNode(agent.id);

    executionEvents.emit({
      executionId: context.executionId,
      nodeType: "agent",
      type: "node:success",
      nodeId: agent.id,
      timestamp: Date.now(),
      nodeName: context.nodeNames[agent.id],
      duration: performance.now() - started,
    });
  } catch (error) {
    contextManager.incrementErrors();
    contextManager.failNode(agent.id);

    // if (edge) {
    //   executionEvents.emit({
    //     type: "edge:error",
    //     edgeId: edge.id,
    //     error: error instanceof Error ? error : new Error(String(error)),
    //     timestamp: Date.now(),
    //   });
    // }

    executionEvents.emit({
      executionId: context.executionId,
      nodeType: "agent",
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
