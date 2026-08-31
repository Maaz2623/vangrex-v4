import { tool } from "ai";
import { z } from "zod";
import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { executeTool } from "../execution/execute-tool";
import { ExecutionContext } from "../execution/execution-context";
import { Workspace } from "../workspace/workspace-manager";
import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";

export interface WeatherToolParameters {
  units: "metric" | "imperial";
}

export function createWeatherTool(
  node: ToolFlowNode,
  context: ExecutionContext,
) {
  const parameters = node.data.config
    .parameters as unknown as WeatherToolParameters;

  return tool({
    description: node.data.description,

    inputSchema: z.object({
      city: z.string(),
    }),

    // weather.tool.ts
    execute: async ({ city }) =>
      executeTool(node, context, async () => {
        return {
          city,
          temperature: 28,
          condition: "Cloudy",
          units: parameters.units,
        };
      }),
  });
}
