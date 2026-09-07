import type { AgentConfig } from "../types/agent-node";

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  instructions:
    "You are a helpful AI agent. Complete the assigned task accurately and return a useful result.",

  prompt: "",

  model: "google/gemini-3.5-flash-lite",

  reasoning: "medium",
};
