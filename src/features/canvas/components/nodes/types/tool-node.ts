import { ToolImplementation } from "@/features/canvas/services/tools/tool-implementation";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";
import { z } from "zod";

export const toolConfigSchema = z.object({
  implementation: z.enum([
    "weather",
    "read_file",
    "write_file",
    "terminal",
    "github_create_repository",
  ]),

  parameters: z.record(z.string(), z.unknown()),
});

export type ToolConfig = z.infer<typeof toolConfigSchema>;

export type ToolNodeData = BaseNodeData<ToolConfig>;

export type ToolFlowNode = FlowNode<ToolConfig, "tool-call">;
