import type { AutopilotWorkflow } from "../planner/planner-schema";

export function validateAutopilotWorkflow(workflow: AutopilotWorkflow) {
  const nodeIds = new Set(workflow.nodes.map((node) => node.id));

  for (const edge of workflow.edges) {
    if (!nodeIds.has(edge.source)) {
      throw new Error(`Invalid edge source: ${edge.source}`);
    }

    if (!nodeIds.has(edge.target)) {
      throw new Error(`Invalid edge target: ${edge.target}`);
    }
  }

  if (!workflow.nodes.some((node) => node.type === "output")) {
    throw new Error("Generated workflow must contain an output node");
  }

  return workflow;
}
