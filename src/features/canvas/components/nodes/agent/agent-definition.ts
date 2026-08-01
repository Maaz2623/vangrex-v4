import { BotIcon } from "lucide-react";
import { AgentNode } from "./agent-node";
import { defaultAgentConfig } from "./defaults";
import { NodeCategory, NodeDefinition } from "../types/node-definition";
import { AgentConfig } from "../types";

export const agentDefinition: NodeDefinition<AgentConfig> = {
  type: "agent",
  name: "AI Agent",
  description: "Run prompts using LLM.",
  icon: BotIcon,
  category: NodeCategory.AI,
  component: AgentNode,
  defaultConfig: defaultAgentConfig,
} as const;
