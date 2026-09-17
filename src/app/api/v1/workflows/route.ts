import { NextResponse } from "next/server";

import { db } from "@/db";
import { workflowsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireApiKey } from "@/features/api-keys/api-key-auth";

export async function GET(request: Request) {
  try {
    // --------------------------------------------------
    // 1. Authenticate API key
    // --------------------------------------------------

    const apiKey = await requireApiKey(request);

    const projectId = apiKey.projectId;

    // --------------------------------------------------
    // 2. Load workflows belonging to the API key project
    // --------------------------------------------------

    const workflows = await db
      .select({
        id: workflowsTable.id,
        name: workflowsTable.name,
        description: workflowsTable.description,
        inputSchema: workflowsTable.inputSchema,
        outputSchema: workflowsTable.outputSchema,
      })
      .from(workflowsTable)
      .where(eq(workflowsTable.projectId, projectId));

    // --------------------------------------------------
    // 3. Return workflow contracts
    // --------------------------------------------------

    return NextResponse.json({
      workflows,
    });
  } catch (error) {
    console.error("Failed to fetch workflows:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch workflows",
      },
      { status: 500 },
    );
  }
}
