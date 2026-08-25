import { FlowEdge } from "@/features/canvas/components/edges/types/base-edge";
import { AppFlowNode } from "@/features/canvas/components/nodes/node-config";
import { eventType, Inngest, staticSchema } from "inngest";

type WorkflowRunData = {
  workflowId: string;
  executionId: string;
  startNodeId: string;
  nodes: AppFlowNode[];
  edges: FlowEdge[];
  input: unknown;
};

export const workflowRun = eventType("workflow/run", {
  schema: staticSchema<WorkflowRunData>(),
});

export const inngest = new Inngest({
  id: "vangrex",
});
