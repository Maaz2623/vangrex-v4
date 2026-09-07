import { BotIcon } from "lucide-react";
import { AgentNode } from "./agent-node";
import { NodeCategory, NodeDefinition } from "../types/node-definition";
import { AgentConfig } from "../types";
import { Position } from "@xyflow/react";
import { DEFAULT_AGENT_CONFIG } from "./defaults";

export const agentDefinition: NodeDefinition<AgentConfig> = {
  type: "agent",
  name: "AI Agent",
  description: "Run prompts using LLM.",
  icon: BotIcon,
  component: AgentNode,
  defaultConfig: DEFAULT_AGENT_CONFIG,
  handles: [
    {
      id: "input",
      name: "Input",
      direction: "target",
      position: Position.Left,
      dataType: "text",
    },
    {
      id: "output",
      name: "Output",
      direction: "source",
      position: Position.Right,
      dataType: "text",
    },
    {
      id: "tool",
      name: "Tool",
      direction: "source",
      position: Position.Bottom,
      dataType: "tool-call",
    },
  ],
} as const;
