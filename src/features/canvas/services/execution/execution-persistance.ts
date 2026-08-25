import { db } from "@/db";
import { executionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createExecution(params: {
  id: string;
  workflowId: string;
  input?: unknown;
}) {
  const [execution] = await db
    .insert(executionsTable)
    .values({
      id: params.id,
      workflowId: params.workflowId,
      status: "running",
      input: (params.input ?? null) as Record<string, unknown> | null,
      startedAt: new Date(),
    })
    .returning();

  return execution;
}

export async function completeExecution(
  executionId: string,
  params: {
    output?: unknown;
  },
) {
  const [execution] = await db
    .update(executionsTable)
    .set({
      status: "success",
      output: (params.output ?? null) as Record<string, unknown> | null,
      completedAt: new Date(),
    })
    .where(eq(executionsTable.id, executionId))
    .returning();

  return execution;
}

export async function failExecution(executionId: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  const [execution] = await db
    .update(executionsTable)
    .set({
      status: "error",
      error: message,
      completedAt: new Date(),
    })
    .where(eq(executionsTable.id, executionId))
    .returning();

  return execution;
}

export async function getExecution(executionId: string) {
  const [execution] = await db
    .select()
    .from(executionsTable)
    .where(eq(executionsTable.id, executionId));

  return execution;
}

export async function setExecutionSandbox(
  executionId: string,
  sandboxId: string,
) {
  const [execution] = await db
    .update(executionsTable)
    .set({
      sandboxId,
    })
    .where(eq(executionsTable.id, executionId))
    .returning();

  return execution;
}
