import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { apiKeysTable, executionsTable, workflowsTable } from "@/db/schema";

import { requireApiKey } from "@/features/api-keys/api-key-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ executionId: string }> },
) {
  try {
    const { executionId } = await params;

    const apiKey = await requireApiKey(request);

    const [execution] = await db
      .select({
        id: executionsTable.id,
        workflowId: executionsTable.workflowId,
        status: executionsTable.status,
        input: executionsTable.input,
        output: executionsTable.output,
        error: executionsTable.error,
        startedAt: executionsTable.startedAt,
        completedAt: executionsTable.completedAt,
        createdAt: executionsTable.createdAt,
      })
      .from(executionsTable)
      .innerJoin(
        workflowsTable,
        eq(executionsTable.workflowId, workflowsTable.id),
      )
      .where(
        and(
          eq(executionsTable.id, executionId),
          eq(workflowsTable.projectId, apiKey.projectId),
        ),
      )
      .limit(1);

    if (!execution) {
      return NextResponse.json(
        { error: "Execution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(execution);
  } catch (error) {
    console.error("Failed to get execution:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to get execution",
      },
      { status: 500 },
    );
  }
}
