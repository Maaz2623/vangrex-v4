import { AppFlowNode } from "./features/canvas/components/nodes/node-config";

export const initialNodes: AppFlowNode[] = [
  {
    id: "0",
    type: "variable",
    position: {
      x: 100,
      y: 100,
    },
    data: {
      title: "City Variable",
      description: "Stores the city name",
      config: {
        name: "city",
        value: "Bangalore",
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
      x: 450,
      y: 100,
    },
    data: {
      title: "Customer Agent",
      description: "Handles customer support",
      config: {
        model: "Gemini 2.5 Flash",
        prompt: `
What is the current weather in {{variables.city}}?

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
    id: "2",
    type: "tool-call",
    position: {
      x: 850,
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
    id: "3",
    type: "agent",
    position: {
      x: 1300,
      y: 100,
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
