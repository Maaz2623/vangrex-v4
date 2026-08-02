import { AppFlowNode } from "./features/canvas/components/nodes/node-config";
import { NodeCategory } from "./features/canvas/components/nodes/types/node-definition";

export const initialNodes: AppFlowNode[] = [
  {
    id: "1",
    type: "agent",
    position: {
      x: 100,
      y: 100,
    },
    data: {
      title: "Customer Agent",
      description: "Handles customer support",
      config: {
        model: "Gemini 2.5 Flash",
        prompt: "What is the weather in bangalore?",
        temperature: 0.7,
        maxTokens: 4096,
      },
      metadata: {
        status: "idle",
        disabled: false,
        collapsed: false,
        locked: false,
      },
    },
  },

  {
    id: "2",
    type: "tool-call",
    position: {
      x: 500,
      y: 100,
    },
    data: {
      title: "Weather Tool",
      description: "Returns the current weather for a given city.",
      config: {
        implementation: "weather",
      },
      metadata: {
        status: "idle",
        disabled: false,
        collapsed: false,
        locked: false,
      },
    },
  },
];
