// weather.tool.ts

import { tool } from "ai";
import { z } from "zod";
import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { executionEvents } from "../execution/execution-events";
import { delay } from "@/lib/delay";

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
      await delay(3000);

      executionEvents.emit({
        type: "tool:start",
        nodeId: node.id,
        timestamp: Date.now(),
      });

      await delay(3000);

      try {
        // logic goes here

        executionEvents.emit({
          type: "tool:success",
          nodeId: node.id,
          timestamp: Date.now(),
        });

        return {
          city,
          temperature: 28,
          condition: "Cloudy",
        };
      } catch (error) {
        executionEvents.emit({
          type: "tool:error",
          nodeId: node.id,
          error: error instanceof Error ? error : new Error(String(error)),
          timestamp: Date.now(),
        });
      }
    },
  });
}
