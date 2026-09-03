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
import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";
import { instructions } from "../../../../../instructions";
import { getInputFromEdges } from "../graph/get-inputs-from-edges";
import { PublishNodeStatus } from "./graph-executor";

export async function executeAgent(
  agent: AgentFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  contextManager: ExecutionContextManager,
  userId: string,
  publishNodeStatus: PublishNodeStatus,
) {
  const context = contextManager.getContext();

  const inputs = getInputFromEdges(agent.id, edges, context);

  contextManager.recordAgentExecution();

  const started = performance.now();

  const connectedTools = getConnectedTools(agent.id, nodes, edges);

  const edge =
    connectedTools.length > 0
      ? getConnectingEdge(agent.id, connectedTools[0].id, edges)
      : undefined;

  if (!context.executionId) {
    throw new Error("No execution Id");
  }

  try {
    const basePrompt = interpolatePrompt(agent.data.config.prompt, context);

    const inputText = inputs
      .map((input) => {
        if (input.output.type === "agent") {
          return input.output.text;
        }

        return JSON.stringify(input.output);
      })
      .join("\n\n");

    const prompt = inputText
      ? `${basePrompt}

CONNECTED INPUT:
${inputText}

Use the connected input as data for this task.`
      : basePrompt;

    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: agent.id,
      status: "running",
    });

    const tools = createTools(connectedTools, context, userId);

    const result = await generateText({
      model: defaultModel,
      prompt,
      tools,
      reasoning: "medium",
      stopWhen: ({ steps }) => steps.length >= 50,
      instructions: instructions,
    });

    contextManager.setOutput(agent.id, {
      type: "agent",
      text: result.text,
    });

    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: agent.id,
      status: "success",
    });
  } catch (error) {
    contextManager.incrementErrors();
    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: agent.id,
      status: "error",
    });
    throw error;
  }
}
