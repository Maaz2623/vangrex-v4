import { AgentFlowNode } from "./features/canvas/components/nodes/types";

export const nodes: AgentFlowNode[] = [
  {
    id: "1",
    type: "agent",
    position: {
      x: 100,
      y: 100,
    },
    data: {
      title: "Customer Agent",
      description: "Handles support",
      status: "idle",
      config: {
        model: "Gemini 2.5 Flash",
        prompt: "You are a helpful assistant.",
        temperature: 0.7,
        maxTokens: 4096,
      },
    },
  },
];
