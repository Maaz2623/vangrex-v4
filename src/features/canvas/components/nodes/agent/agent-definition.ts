import { BotIcon } from "lucide-react";
import { AgentNode } from "./agent-node";
import { defaultAgentConfig } from "./defaults";
import { NodeCategory, NodeDefinition } from "../types/node-definition";
import { AgentConfig } from "../types";
import { Position } from "@xyflow/react";

export const agentDefinition: NodeDefinition<AgentConfig> = {
  type: "agent",
  name: "AI Agent",
  description: "Run prompts using LLM.",
  icon: BotIcon,
  component: AgentNode,
  defaultConfig: defaultAgentConfig,
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
