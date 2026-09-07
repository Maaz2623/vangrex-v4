import { agentConfigSchema } from "@/features/canvas/components/nodes/types/agent-node";
import type { AutopilotNode } from "../workflow/workflow-schema";

export function validateNodeConfig(node: AutopilotNode): string[] {
  if (node.type !== "agent") {
    return [];
  }

  const result = agentConfigSchema.safeParse(node.config);

  if (result.success) {
    return [];
  }

  return result.error.issues.map(
    (issue) =>
      `Node "${node.name}" config: ${issue.path.join(".")} ${issue.message}`,
  );
}
