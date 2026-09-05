import type { AutopilotWorkflow } from "../planner/planner-schema";

export async function generateAutopilotWorkflow(
  prompt: string,
): Promise<AutopilotWorkflow> {
  const response = await fetch("/api/autopilot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(body?.error ?? "Failed to generate Autopilot workflow");
  }

  return response.json();
}
