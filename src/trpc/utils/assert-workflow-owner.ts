import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { projectsTable, workflowsTable } from "@/db/schema";

export async function assertWorkflowOwner(workflowId: string, userId: string) {
  const [workflow] = await db
    .select()
    .from(workflowsTable)
    .where(eq(workflowsTable.id, workflowId));

  if (!workflow) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Workflow not found.",
    });
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, workflow.projectId));

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found.",
    });
  }

  if (project.ownerId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }

  return workflow;
}
