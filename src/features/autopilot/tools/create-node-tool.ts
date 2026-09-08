import { db } from "@/db";
import { nodesTable } from "@/db/schema";
import { agentConfigSchema, outputConfigSchema, variableConfigSchema } from "@/features/canvas/components/nodes/types";
import { sandboxConfigSchema } from "@/features/canvas/components/nodes/types/sandbox-node";
import { toolConfigSchema } from "@/features/canvas/components/nodes/types/tool-node";
import { tool } from "ai";
import z from "zod";

const nodeSchema = z.object({
  type: z.enum(["agent", "tool-call", "variable", "output", "sandbox"]),

  position: z.object({
    x: z.number(),
    y: z.number(),
  }),

  data: z.object({
    title: z.string(),
    description: z.string(),
    config: z.union([
      agentConfigSchema,
      variableConfigSchema,
      outputConfigSchema,
      sandboxConfigSchema,
      toolConfigSchema
    ]),
    metadata: z.object({
      status: z.enum(["idle", "running", "success", "error"]),
      disabled: z.boolean(),
      collapsed: z.boolean(),
      locked: z.boolean(),
    }),
  }),
});

export const createNodeTool = (workflowId: string) =>
  tool({
    description: "Create a node in the canvas for the workflow.",

    inputSchema: z.object({
      node: nodeSchema,
    }),

    execute: async ({ node }) => {
      const nodeId = crypto.randomUUID();

      await db.insert(nodesTable).values({
        id: nodeId,
        workflowId,
        type: node.type,
        title: node.data.title,
        description: node.data.description,
        positionX: node.position.x,
        positionY: node.position.y,
        config: node.data.config,
        metadata: node.data.metadata,
      });

      return {
        success: true,
        nodeId,
      };
    },
  });
