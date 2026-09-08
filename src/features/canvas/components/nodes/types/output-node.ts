import z from "zod";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export const outputConfigSchema = z.object({
  output: z
    .string()
    .default(
      "No output yet. Please execute the graph or connect an input node",
    ),
});

export type OutputConfig = z.infer<typeof outputConfigSchema>;

export type OutputNodeData = BaseNodeData<OutputConfig>;

export type OutputFlowNode = FlowNode<OutputConfig, "output">;
