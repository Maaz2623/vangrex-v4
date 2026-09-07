import { z } from "zod";

export const autopilotAgentNodeSchema = z.object({
  id: z.string(),
  type: z.literal("agent"),
  name: z.string(),
  purpose: z.string(),

  instructions: z.string(),
  prompt: z.string(),
  model: z.string(),
  reasoning: z.enum(["none", "low", "medium", "high"]),
});

export const autopilotOutputNodeSchema = z.object({
  id: z.string(),
  type: z.literal("output"),
  name: z.string(),
  purpose: z.string(),
});

const nodeSchema = z.discriminatedUnion("type", [
  autopilotAgentNodeSchema,
  autopilotOutputNodeSchema,
]);

const edgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  sourceHandle: z.literal("output"),
  targetHandle: z.literal("input"),
});

export const autopilotWorkflowSchema = z.object({
  name: z.string(),
  description: z.string(),

  nodes: z.array(nodeSchema),

  edges: z.array(edgeSchema),

  executionPolicy: z.object({
    allowParallel: z.boolean(),
    maxIterations: z.number().int().positive(),
  }),
});

export type AutopilotWorkflow = z.infer<typeof autopilotWorkflowSchema>;
