import { AppFlowNode } from "./features/canvas/components/nodes/node-config";
import { NodeCategory } from "./features/canvas/components/nodes/types/node-definition";

export const initialNodes: AppFlowNode[] = [
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
        parameters: {},
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
        prompt: `
What is the current weather in Bangalore?

Use the Weather Tool and tell the user.
`.trim(),
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
    id: "3",
    type: "agent",
    position: {
      x: 100,
      y: 350,
    },
    data: {
      title: "Customer Agent 2",
      description: "Summarizes the previous agent's response",
      config: {
        model: "Gemini 2.5 Flash",
        prompt: `
You are a summarization agent.

Summarize the following response in exactly one sentence.

{{Customer Agent}}
      `.trim(),
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
];
