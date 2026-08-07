import { AppFlowNode } from "../../components/nodes/node-config";

export function createFlowNode(
  type: AppFlowNode["type"],
  position: {
    x: number;
    y: number;
  },
): AppFlowNode {
  const id = crypto.randomUUID();

  switch (type) {
    case "agent":
      return {
        id,
        type: "agent",
        position,

        data: {
          title: "Agent",
          description: "AI agent",

          config: {
            model: "Gemini 2.5 Flash",
            prompt: "",
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
      };

    case "variable":
      return {
        id,
        type: "variable",
        position,

        data: {
          title: "Variable",
          description: "Workflow variable",

          config: {
            name: "variable",
            type: "text",
            value: "",
            description: "",
            secret: false,
            editable: true,
            global: false,
          },

          metadata: {
            status: "idle",
            disabled: false,
            collapsed: false,
            locked: false,
          },
        },
      };

    case "output":
      return {
        id,
        type: "output",
        position,

        data: {
          title: "Output",
          description: "Workflow output",

          config: {},

          metadata: {
            status: "idle",
            disabled: false,
            collapsed: false,
            locked: false,
          },
        },
      };

    case "tool-call":
      return {
        id,
        type: "tool-call",
        position,

        data: {
          title: "Tool",
          description: "Tool call",

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
      };
  }
}
