import { generateText, Output } from "ai";
import { AutopilotWorkflow, autopilotWorkflowSchema } from "./planner-schema";
import { defaultModel } from "@/features/canvas/services/execution/model";
import { AUTOPILOT_PLANNER_PROMPT } from "./planner-prompt";

export async function generateAutopilotWorkflow(
  userRequest: string,
): Promise<AutopilotWorkflow> {
  if (!userRequest.trim()) {
    throw new Error("Autopilot Request cannot be empty");
  }

  const result = await generateText({
    model: defaultModel,
    output: Output.object({
      schema: autopilotWorkflowSchema,
    }),
    instructions: AUTOPILOT_PLANNER_PROMPT,
    prompt: `
Design a Vangrex workflow for the following user request:

${userRequest}
`,
  });

  return result.output;
}
