import z from "zod";
import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export const outputConfigSchema = z.object({
  output: z.string(),
});

export type OutputConfig = z.infer<typeof outputConfigSchema>;

export type OutputNodeData = BaseNodeData<OutputConfig>;

export type OutputFlowNode = FlowNode<OutputConfig, "output">;
