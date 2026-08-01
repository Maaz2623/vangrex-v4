import { Node } from "@xyflow/react";
import { AppFlowNode } from "./features/canvas/components/nodes/node-config";

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
      description: "Handles support",
      config: {
        model: "Gemini 2.5 Flash",
        prompt: "You are a helpful assistant.",
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
    type: "function",
    position: {
      x: 500,
      y: 100,
    },
    data: {
      title: "Transform Data",
      description: "Process workflow data",
      config: {
        language: "typescript",
        runtime: "node",
        code: `export default async function(input) {
  return input;
}`,
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
