import {
  agentConfigSchema,
  outputConfigSchema,
  variableConfigSchema,
} from "@/features/canvas/components/nodes/types";
import { sandboxConfigSchema } from "@/features/canvas/components/nodes/types/sandbox-node";
import { toolConfigSchema } from "@/features/canvas/components/nodes/types/tool-node";
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
 * Other node types.
 *
 * Their individual config schemas will be added
 * one at a time as we implement them.
 */
export const autopilotGenericNodeSchema = z.object({
  id: z.string().min(1),

  type: z.enum(["tool-call", "variable", "output", "sandbox", "agent"]),

  name: z.string().min(1),
  purpose: z.string().min(1),

  config: z.union([
    agentConfigSchema,
    outputConfigSchema,
    sandboxConfigSchema,
    toolConfigSchema,
    variableConfigSchema
  ]),
});

/**
 * Autopilot node
 */

/**
 * Autopilot workflow
 */
export const autopilotWorkflowSchema = z.object({
  name: z.string().min(1),
  description: z.string(),

  nodes: z.array(autopilotGenericNodeSchema),

  edges: z.array(autopilotEdgeSchema),
});

/**
 * Types
 */

export type AutopilotNode = z.infer<typeof autopilotGenericNodeSchema>;

export type AutopilotEdge = z.infer<typeof autopilotEdgeSchema>;

export type AutopilotWorkflow = z.infer<typeof autopilotWorkflowSchema>;
