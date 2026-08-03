// weather.tool.ts

import { tool } from "ai";
import { z } from "zod";
import { ToolFlowNode } from "../../components/nodes/types/tool-node";

export interface WeatherToolParameters {
  unitls: "metric" | "imperial";
}

export function createWeatherTool(node: ToolFlowNode) {
  const parameters = node.data.config
    .parameters as unknown as WeatherToolParameters;

  return tool({
    description: node.data.description,

    inputSchema: z.object({
      city: z.string(),
    }),

    execute: async ({ city }) => {
      return {
        city,
        temperature: 28,
        condition: "Cloudy",
      };
    },
  });
}
