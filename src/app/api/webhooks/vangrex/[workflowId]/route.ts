import { db } from "@/db";
import { workflowsTable } from "@/db/schema";
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

  return NextResponse.json({
    success: true,
    received: true,
    workflowId,
  });
}
