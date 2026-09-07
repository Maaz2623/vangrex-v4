import type { AutopilotWorkflow } from "../workflow/workflow-schema";

import { validateNodeConfig } from "./node-config-validator";

export interface WorkflowValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAutopilotWorkflow(
  workflow: AutopilotWorkflow,
): WorkflowValidationResult {
  const errors: string[] = [];

  // Validate node configurations
  for (const node of workflow.nodes) {
    errors.push(...validateNodeConfig(node));
  }

  // Collect node IDs
  const nodeIds = new Set(workflow.nodes.map((node) => node.id));

  // Duplicate node IDs
  if (nodeIds.size !== workflow.nodes.length) {
    errors.push("Workflow contains duplicate node IDs.");
  }

  // No nodes
  if (workflow.nodes.length === 0) {
    errors.push("Workflow must contain at least one node.");
  }

  // Output nodes
  const outputNodes = workflow.nodes.filter((node) => node.type === "output");

  if (outputNodes.length === 0) {
    errors.push("Workflow must contain at least one output node.");
  }

  // Edge validation
  for (const edge of workflow.edges) {
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge references missing source node: ${edge.source}`);
    }

    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge references missing target node: ${edge.target}`);
    }

    // Self connection
    if (edge.source === edge.target) {
      errors.push(`Node ${edge.source} cannot connect to itself.`);
    }
  }

  // Build connectivity maps
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, number>();

  for (const node of workflow.nodes) {
    incoming.set(node.id, 0);
    outgoing.set(node.id, 0);
  }

  for (const edge of workflow.edges) {
    // Only count edges whose source actually exists
    if (nodeIds.has(edge.source)) {
      outgoing.set(edge.source, (outgoing.get(edge.source) ?? 0) + 1);
    }

    // Only count edges whose target actually exists
    if (nodeIds.has(edge.target)) {
      incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
    }
  }

  // Disconnected nodes
  if (workflow.nodes.length > 1) {
    for (const node of workflow.nodes) {
      const hasIncoming = (incoming.get(node.id) ?? 0) > 0;

      const hasOutgoing = (outgoing.get(node.id) ?? 0) > 0;

      if (!hasIncoming && !hasOutgoing) {
        errors.push(`Node ${node.id} (${node.name}) is disconnected.`);
      }
    }
  }

  // Output nodes should not have outgoing connections
  for (const node of outputNodes) {
    if ((outgoing.get(node.id) ?? 0) > 0) {
      errors.push(
        `Output node ${node.id} (${node.name}) cannot have outgoing connections.`,
      );
    }
  }

  // Non-output nodes should not be terminal
  for (const node of workflow.nodes) {
    if (node.type !== "output" && (outgoing.get(node.id) ?? 0) === 0) {
      errors.push(`Node ${node.id} (${node.name}) has no outgoing connection.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
