// src/features/autopilot/planner/schemas/node-schemas.ts

import { z } from "zod";

const autopilotAgentConfigSchema = z
  .object({
    instructions: z.string().min(1),
    prompt: z.string().min(1),
    model: z.string().min(1),
    reasoning: z.enum(["none", "low", "medium", "high"]),
  })
  .strict();

const autopilotOutputConfigSchema = z.object({}).strict();

export const autopilotAgentNodeSchema = z
  .object({
    id: z.string().min(1),
    type: z.literal("agent"),
    name: z.string().min(1),
    purpose: z.string().min(1),
    config: autopilotAgentConfigSchema,
  })
  .strict();

export const autopilotOutputNodeSchema = z
  .object({
    id: z.string().min(1),
    type: z.literal("output"),
    name: z.string().min(1),
    purpose: z.string().min(1),
    config: autopilotOutputConfigSchema,
  })
  .strict();
