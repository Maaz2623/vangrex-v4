import type { Dispatch, SetStateAction } from "react";

import type { AutopilotWorkflow } from "../planner/planner-schema";
import { autopilotWorkflowToFlow } from "./workflow-to-flow";
import { AppFlowNode } from "@/features/canvas/components/nodes/node-config";
import { FlowEdge } from "@/features/canvas/components/edges/types/base-edge";

export function applyAutopilotWorkflow(
  workflow: AutopilotWorkflow,
  setNodes: Dispatch<SetStateAction<AppFlowNode[]>>,
  setEdges: Dispatch<SetStateAction<FlowEdge[]>>,
) {
  const { nodes, edges } = autopilotWorkflowToFlow(workflow);

  setNodes(nodes);
  setEdges(edges);

  return {
    nodes,
    edges,
  };
}
