import { z } from "zod";

import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export const variableConfigSchema = z.object({
  name: z.string(),
  type: z.enum(["text", "number", "json", "boolean"]),
  value: z.string(),
  description: z.string(),
  secret: z.boolean(),
  editable: z.boolean(),
  global: z.boolean(),
});

export type VariableConfig = z.infer<typeof variableConfigSchema>;

export type VariableNodeData = BaseNodeData<VariableConfig>;

export type VariableFlowNode = FlowNode<VariableConfig, "variable">;
