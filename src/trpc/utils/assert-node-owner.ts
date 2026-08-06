import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { nodesTable } from "@/db/schema";
import { assertWorkflowOwner } from "./assert-workflow-owner";

export async function assertNodeOwner(nodeId: string, userId: string) {
  const [node] = await db
    .select()
    .from(nodesTable)
    .where(eq(nodesTable.id, nodeId));

  if (!node) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Node not found.",
    });
  }

  await assertWorkflowOwner(node.workflowId, userId);

  return node;
}
