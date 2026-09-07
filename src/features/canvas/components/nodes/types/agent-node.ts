import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

import { z } from "zod";

export const agentConfigSchema = z.object({
  instructions: z.string(),
  prompt: z.string(),
  model: z.enum([
    "google/gemini-3.5-flash-lite",
    "google/gemini-2.5-flash",
    "google/gemini-2.5-pro",
    "openai/gpt-5",
    "openai/gpt-5-mini",
    "anthropic/claude-sonnet-4.5",
    "anthropic/claude-opus-4.1",
  ]),
  reasoning: z.enum(["none", "low", "medium", "high"]),
});

export type AgentConfig = z.infer<typeof agentConfigSchema>;

export type AgentNodeData = BaseNodeData<AgentConfig>;

export type AgentFlowNode = FlowNode<AgentConfig, "agent">;
