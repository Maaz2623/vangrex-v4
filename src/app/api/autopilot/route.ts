import { NextResponse } from "next/server";
import { generateAutopilotWorkflow } from "@/features/autopilot/planner/planner";
import { validateAutopilotWorkflow } from "@/features/autopilot/validation/validate-workflow";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const workflow = await generateAutopilotWorkflow(body.prompt);


    validateAutopilotWorkflow(workflow)

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("[autopilot]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate workflow",
      },
      { status: 500 },
    );
  }
}
