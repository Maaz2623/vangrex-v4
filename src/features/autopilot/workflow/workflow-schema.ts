import * as z from "zod";

export const autopilotNodeTypeSchema = z.enum([
  "agent",
  "tool-call",
  "variable",
  "output",
  "sandbox",
]);

export const autopilotEdgeSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().min(1),
  targetHandle: z.string().min(1),
});

/**
 * Agent configuration
 */
export const autopilotAgentConfigSchema = z.object({
  instructions: z.string().min(1),
  prompt: z.string().min(1),

  model: z.enum([
    "google/gemini-3.5-flash-lite",
    "google/gemini-2.5-flash",
    "google/gemini-2.5-pro",
    "openai/gpt-5",
    "openai/gpt-5-mini",
    "anthropic/claude-sonnet-4.5",
    "anthropic/claude-opus-4.1",
  ]),

  reasoning: z.enum(["none", "low", "medium", "high"]),
});

/**
 * Agent node
 */
export const autopilotAgentNodeSchema = z.object({
  id: z.string().min(1),
  type: z.literal("agent"),
  name: z.string().min(1),
  purpose: z.string().min(1),
  config: z.object({
    instructions: z.string().min(1),
    prompt: z.string().min(1),

    model: z.enum([
      "google/gemini-3.5-flash-lite",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "openai/gpt-5",
      "openai/gpt-5-mini",
      "anthropic/claude-sonnet-4.5",
      "anthropic/claude-opus-4.1",
    ]),

    reasoning: z.enum(["none", "low", "medium", "high"]),
  }),
});

/**
 * Other node types.
 *
 * Their individual config schemas will be added
 * one at a time as we implement them.
 */
export const autopilotGenericNodeSchema = z.object({
  id: z.string().min(1),

  type: z.enum(["tool-call", "variable", "output", "sandbox"]),

  name: z.string().min(1),
  purpose: z.string().min(1),

  config: z.object({}),
});

/**
 * Autopilot node
 */
export const autopilotNodeSchema = z.discriminatedUnion("type", [
  autopilotAgentNodeSchema,
  autopilotGenericNodeSchema,
]);

/**
 * Autopilot workflow
 */
export const autopilotWorkflowSchema = z.object({
  name: z.string().min(1),
  description: z.string(),

  nodes: z.array(autopilotNodeSchema),

  edges: z.array(autopilotEdgeSchema),
});

/**
 * Types
 */
export type AutopilotAgentConfig = z.infer<typeof autopilotAgentConfigSchema>;

export type AutopilotNode = z.infer<typeof autopilotNodeSchema>;

export type AutopilotEdge = z.infer<typeof autopilotEdgeSchema>;

export type AutopilotWorkflow = z.infer<typeof autopilotWorkflowSchema>;
