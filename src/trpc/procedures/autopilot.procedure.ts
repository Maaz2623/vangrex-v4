import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";

import { workflowsTable, nodesTable, edgesTable } from "@/db/schema";

export const autopilotRouter = createTRPCRouter({
  saveWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.uuid(),

        name: z.string().min(1).max(255),

        description: z.string().optional(),

        nodes: z.array(z.any()),

        edges: z.array(z.any()),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db.transaction(async (tx) => {
        /*
         * ----------------------------------------------------------
         * 1. Verify workflow exists
         * ----------------------------------------------------------
         */

        const [workflow] = await tx
          .select()
          .from(workflowsTable)
          .where(eq(workflowsTable.id, input.workflowId))
          .limit(1);

        if (!workflow) {
          throw new Error("Workflow not found");
        }

        /*
         * ----------------------------------------------------------
         * 2. Update workflow metadata
         * ----------------------------------------------------------
         */

        await tx
          .update(workflowsTable)
          .set({
            name: input.name,
            description: input.description ?? null,
          })
          .where(eq(workflowsTable.id, input.workflowId));

        /*
         * ----------------------------------------------------------
         * 3. Remove existing graph
         * ----------------------------------------------------------
         *
         * Edges first because they reference node IDs logically.
         */

        await tx
          .delete(edgesTable)
          .where(eq(edgesTable.workflowId, input.workflowId));

        await tx
          .delete(nodesTable)
          .where(eq(nodesTable.workflowId, input.workflowId));

        /*
         * ----------------------------------------------------------
         * 4. Insert nodes
         * ----------------------------------------------------------
         */

        if (input.nodes.length > 0) {
          await tx.insert(nodesTable).values(
            input.nodes.map((node) => ({
              id: node.id,

              workflowId: input.workflowId,

              type: node.type,

              title: node.title,

              description: node.description ?? null,

              positionX: node.position.x,
              positionY: node.position.y,

              config: node.data.config,

              metadata: node.data.metadata,
            })),
          );
        }

        /*
         * ----------------------------------------------------------
         * 5. Insert edges
         * ----------------------------------------------------------
         */

        if (input.edges.length > 0) {
          await tx.insert(edgesTable).values(
            input.edges.map((edge) => ({
              id: edge.id,

              workflowId: input.workflowId,

              source: edge.source,
              target: edge.target,

              sourceHandle: edge.sourceHandle ?? null,
              targetHandle: edge.targetHandle ?? null,

              config: edge.data.config,

              metadata: edge.data.metadata,
            })),
          );
        }

        return {
          workflowId: input.workflowId,
          nodeCount: input.nodes.length,
          edgeCount: input.edges.length,
        };
      });

      return result;
    }),
});
