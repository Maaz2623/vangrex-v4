import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  projectsTable,
  workflowsTable,
  nodesTable,
  edgesTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

import { createExecution } from "@/features/canvas/services/execution/execution-persistance";
import { executeWorkflowTask } from "@/trigger/execute-workflow";
import { mapDbNodeToAppFlowNode } from "@/features/canvas/services/db-node-mapper";
import { requireApiKey } from "@/features/api-keys/api-key-auth";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ workflowId: string }>;
  },
) {
  try {
    const { workflowId } = await params;

    const body = await request.json().catch(() => ({}));

    const input = body.input ?? null;

    const apiKey = await requireApiKey(request);

    const userId = apiKey.userId;

    const projectId = apiKey.projectId;

    // --------------------------------------------------
    // 1. Verify workflow ownership
    // --------------------------------------------------

    const [workflow] = await db
      .select({
        id: workflowsTable.id,
        projectId: workflowsTable.projectId,
        name: workflowsTable.name,
      })
      .from(workflowsTable)
      .where(
        and(
          eq(workflowsTable.id, workflowId),
          eq(workflowsTable.projectId, projectId),
        ),
      );

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 },
      );
    }

    // --------------------------------------------------
    // 2. Load workflow graph
    // --------------------------------------------------

    const [nodes, edges] = await Promise.all([
      db.select().from(nodesTable).where(eq(nodesTable.workflowId, workflowId)),

      db.select().from(edgesTable).where(eq(edgesTable.workflowId, workflowId)),
    ]);

    if (nodes.length === 0) {
      return NextResponse.json(
        { error: "Workflow has no nodes" },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // 3. Find the start node
    // --------------------------------------------------

    const targetNodeIds = new Set(edges.map((edge) => edge.target));

    const startNode = nodes.find((node) => !targetNodeIds.has(node.id));

    if (!startNode) {
      return NextResponse.json(
        { error: "Could not determine workflow start node" },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // 4. Convert database nodes into AppFlowNodes
    // --------------------------------------------------

    const appNodes = nodes.map(mapDbNodeToAppFlowNode);
    // --------------------------------------------------
    // 5. Convert database edges into FlowEdges
    // --------------------------------------------------

    const appEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle ?? undefined,
      targetHandle: edge.targetHandle ?? undefined,
      config: edge.config,
      metadata: edge.metadata,
    }));

    // --------------------------------------------------
    // 6. Create execution
    // --------------------------------------------------

    const executionId = crypto.randomUUID();

    await createExecution({
      id: executionId,
      workflowId,
      input,
    });

    // --------------------------------------------------
    // 7. Trigger durable execution
    // --------------------------------------------------

    await executeWorkflowTask.trigger({
      workflowId,
      executionId,
      startNodeId: startNode.id,
      nodes: appNodes,
      edges: appEdges,
      input,
      userId,
    });

    // --------------------------------------------------
    // 8. Return immediately
    // --------------------------------------------------

    return NextResponse.json(
      {
        executionId,
        status: "queued",
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Failed to trigger workflow:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to trigger workflow",
      },
      { status: 500 },
    );
  }
}
