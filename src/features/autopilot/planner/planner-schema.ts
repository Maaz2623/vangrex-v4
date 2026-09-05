import z from "zod";

export const autopilotNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["agent", "tool-call", "variable", "output", "sandbox"]),
  name: z.string(),
  purpose: z.string(),
  config: z.record(z.string(), z.unknown()).default({}),
});

export const autopilotEdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().default("output"),
  targetHandle: z.string().default("input"),
});
export const autopilotWorkflowSchema = z.object({
  name: z.string(),
  description: z.string(),

  nodes: z.array(autopilotNodeSchema).min(1),

  edges: z.array(autopilotEdgeSchema),

  executionPolicy: z.object({
    allowParallel: z.boolean(),
    maxIterations: z.number().int().positive(),
  }),
});
export type AutopilotWorkflow = z.infer<typeof autopilotWorkflowSchema>;
