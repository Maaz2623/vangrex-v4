import { generateText, Output } from "ai";

import { AutopilotWorkflow, autopilotWorkflowSchema } from "./planner-schema";

import { defaultModel } from "@/features/canvas/services/execution/model";
import { AUTOPILOT_PLANNER_PROMPT } from "./planner-prompt";

export async function generateAutopilotWorkflow(
  userRequest: string,
): Promise<AutopilotWorkflow> {
  if (!userRequest.trim()) {
    throw new Error("Autopilot request cannot be empty");
  }

  const result = await generateText({
    model: defaultModel,

    instructions: AUTOPILOT_PLANNER_PROMPT,

    prompt: `
Design a Vangrex workflow for this user request:

<user_request>
${userRequest}
</user_request>

Return the workflow object required by the schema.
`,

    output: Output.object({
      schema: autopilotWorkflowSchema,
    }),
  });

  if (!result.output) {
    throw new Error("Autopilot model returned no workflow");
  }

  return autopilotWorkflowSchema.parse(result.output);
}
