import { db } from "@/db";
import { edgesTable, nodesTable, workflowsTable } from "@/db/schema";
import { mapDbNodeToAppFlowNode } from "@/features/canvas/services/db-node-mapper";
import { initializeExecutionSystem } from "@/features/canvas/services/execution/execution-bootstrap";
import { ExecutionManager } from "@/features/canvas/services/execution/execution-manager";
import {
  completeExecution,
  createExecution,
} from "@/features/canvas/services/execution/execution-persistance";
import { formatExecutionOutput } from "@/features/canvas/services/execution/output-formatter";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      workflowId: string;
    }>;
  },
) {
  const { workflowId } = await params;

  const [workflow] = await db
    .select()
    .from(workflowsTable)
    .where(eq(workflowsTable.id, workflowId));

  if (!workflow) {
    return NextResponse.json(
      {
        success: false,
        error: "Workflow not found",
      },
      {
        status: 404,
      },
    );
  }

  let body: unknown = null;

  try {
    body = await request.json();
  } catch (error) {
    body = null;
  }

  console.log("Webhook received: ", {
    workflowId,
    body,
  });

  const dbNodes = await db
    .select()
    .from(nodesTable)
    .where(eq(nodesTable.workflowId, workflow.id));

  const nodes = dbNodes.map(mapDbNodeToAppFlowNode);

  const edges = await db
    .select()
    .from(edgesTable)
    .where(eq(edgesTable.workflowId, workflow.id));

  try {
    const executionManager = new ExecutionManager();

    initializeExecutionSystem();

    const executionId = crypto.randomUUID();

    await createExecution({
      id: executionId,
      workflowId,
      input: body,
    });

    await executionManager.execute(nodes, edges, {
      workflowId,
      input: body,
      executionId,
    });

    return NextResponse.json({
      success: true,
      executionId,
      workflowId,
      status: "queued",
    });
  } catch (error) {
    console.log("Webhook failed");

    return NextResponse.json(
      {
        success: true,
        workflowId,
        error:
          error instanceof Error ? error.message : "Workflow execution failed.",
      },
      {
        status: 500,
      },
    );
  }
}
