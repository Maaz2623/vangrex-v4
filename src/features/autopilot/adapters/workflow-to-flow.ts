
import { AppFlowNode } from "@/features/canvas/components/nodes/node-config";
import type { AutopilotWorkflow } from "../planner/planner-schema";
import { createFlowNode } from "@/features/canvas/services/nodes/create-node";
import { FlowEdge } from "@/features/canvas/components/edges/types/base-edge";

interface FlowPosition {
  x: number;
  y: number;
}

const NODE_WIDTH = 280;
const NODE_HEIGHT = 160;

const HORIZONTAL_GAP = 180;
const VERTICAL_GAP = 80;

/**
 * Creates a deterministic layered layout from the
 * Autopilot workflow DAG.
 */
function calculateNodePositions(
  workflow: AutopilotWorkflow,
): Map<string, FlowPosition> {
  const positions = new Map<string, FlowPosition>();

  const nodeIds = new Set(workflow.nodes.map((node) => node.id));

  // Incoming edge count for each node.
  const incomingCount = new Map<string, number>();

  // Outgoing adjacency list.
  const outgoing = new Map<string, string[]>();

  for (const node of workflow.nodes) {
    incomingCount.set(node.id, 0);
    outgoing.set(node.id, []);
  }

  for (const edge of workflow.edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      continue;
    }

    incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1);

    outgoing.get(edge.source)?.push(edge.target);
  }

  /**
   * Layer 0 = nodes with no dependencies.
   */
  const layers: string[][] = [];

  let currentLayer = workflow.nodes
    .filter((node) => (incomingCount.get(node.id) ?? 0) === 0)
    .map((node) => node.id);

  const visited = new Set<string>();

  while (currentLayer.length > 0) {
    layers.push(currentLayer);

    const nextLayer: string[] = [];

    for (const nodeId of currentLayer) {
      visited.add(nodeId);

      for (const targetId of outgoing.get(nodeId) ?? []) {
        const remaining = (incomingCount.get(targetId) ?? 0) - 1;

        incomingCount.set(targetId, remaining);

        if (remaining === 0) {
          nextLayer.push(targetId);
        }
      }
    }

    currentLayer = nextLayer;
  }

  /**
   * If something wasn't placed, put it in the final layer.
   * This also prevents the layout from silently losing nodes
   * in malformed/cyclic workflows.
   */
  const unplaced = workflow.nodes
    .map((node) => node.id)
    .filter((id) => !visited.has(id));

  if (unplaced.length > 0) {
    layers.push(unplaced);
  }

  /**
   * Position layers horizontally.
   *
   * Example:
   *
   *        Architecture
   *        /          \
   * Frontend          Backend
   *        \          /
   *             Sandbox
   *                |
   *                QA
   */
  for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
    const layer = layers[layerIndex];

    const totalHeight =
      layer.length * NODE_HEIGHT + Math.max(0, layer.length - 1) * VERTICAL_GAP;

    const startY = -totalHeight / 2;

    for (let index = 0; index < layer.length; index++) {
      const nodeId = layer[index];

      positions.set(nodeId, {
        x: layerIndex * (NODE_WIDTH + HORIZONTAL_GAP),
        y: startY + index * (NODE_HEIGHT + VERTICAL_GAP),
      });
    }
  }

  return positions;
}

function createGeneratedNode(
  workflowNode: AutopilotWorkflow["nodes"][number],
  position: FlowPosition,
): AppFlowNode {
  /**
   * Use your existing factory so generated nodes get exactly
   * the same defaults/metadata/handles as manually-created nodes.
   */
  const node = createFlowNode(
    workflowNode.type as AppFlowNode["type"],
    position,
  );

  return {
    ...node,

    id: workflowNode.id,

    data: {
      ...node.data,

      title: workflowNode.name,
      description: workflowNode.purpose,

      /**
       * Keep factory defaults, but allow the planner to provide
       * configuration.
       */
      config: {
        ...node.data.config,
        ...(workflowNode.config ?? {}),
      },
    },
  } as AppFlowNode;
}

export function autopilotWorkflowToFlow(workflow: AutopilotWorkflow): {
  nodes: AppFlowNode[];
  edges: FlowEdge[];
} {
  const positions = calculateNodePositions(workflow);

  const nodes: AppFlowNode[] = workflow.nodes.map((workflowNode) => {
    const position = positions.get(workflowNode.id) ?? {
      x: 0,
      y: 0,
    };

    return createGeneratedNode(workflowNode, position);
  });

  const edges: FlowEdge[] = workflow.edges.map((workflowEdge) => ({
    id: crypto.randomUUID(),

    source: workflowEdge.source,
    target: workflowEdge.target,

    sourceHandle: workflowEdge.sourceHandle ?? "output",
    targetHandle: workflowEdge.targetHandle ?? "input",

    type: "default",

    data: {
      config: {},

      metadata: {
        executionState: "idle",
        animated: false,
        executionCount: 0,
        disabled: false,
      },
    },
  }));

  return {
    nodes,
    edges,
  };
}
