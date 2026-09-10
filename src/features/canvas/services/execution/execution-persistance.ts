import { db } from "@/db";
import { executionNodesTable, executionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NodeStatusType } from "../../components/nodes/types";

/**
 * Create the top-level execution record.
 */
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
      input: params.input ?? null,
      startedAt: new Date(),
    })
    .returning();

  return execution;
}

/**
 * Complete the top-level execution.
 */
export async function completeExecution(
  executionId: string,
  params: { output?: unknown },
) {
  const [execution] = await db
    .update(executionsTable)
    .set({
      status: "success",
      output: params.output ?? null,
      completedAt: new Date(),
    })
    .where(eq(executionsTable.id, executionId))
    .returning();

  return execution;
}

/**
 * Fail the top-level execution.
 */
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

/**
 * Get a single execution.
 */
export async function getExecution(executionId: string) {
  const [execution] = await db
    .select()
    .from(executionsTable)
    .where(eq(executionsTable.id, executionId));

  return execution;
}

/**
 * Persist the sandbox associated with an execution.
 */
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

/**
 * Create a node execution record.
 *
 * One row represents one node in one execution.
 */
export async function createExecutionNode(params: {
  executionId: string;
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
}) {
  const [executionNode] = await db
    .insert(executionNodesTable)
    .values({
      executionId: params.executionId,
      nodeId: params.nodeId,
      nodeType: params.nodeType,
      nodeTitle: params.nodeTitle,
      status: "idle",
    })
    .returning();

  return executionNode;
}

/**
 * Update the durable state of a node execution.
 */
export async function updateExecutionNode(
  executionId: string,
  nodeId: string,
  params: {
    status?: NodeStatusType;
    input?: Record<string, unknown> | null;
    output?: Record<string, unknown> | null;
    error?: string | null;
    startedAt?: Date | null;
    completedAt?: Date | null;
    duration?: number | null;
  },
) {
  const [executionNode] = await db
    .update(executionNodesTable)
    .set(params)
    .where(eq(executionNodesTable.executionId, executionId))
    .returning();

  return executionNode;
}

/**
 * Persist the output produced by a node.
 */
export async function setExecutionNodeOutput(
  executionId: string,
  nodeId: string,
  output: Record<string, unknown> | null,
) {
  const [executionNode] = await db
    .update(executionNodesTable)
    .set({
      output,
    })
    .where(eq(executionNodesTable.executionId, executionId))
    .returning();

  return executionNode;
}
