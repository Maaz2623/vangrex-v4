import { DEFAULT_AGENT_CONFIG } from "../../components/nodes/agent/defaults";
import { AppFlowNode } from "../../components/nodes/node-config";
import { AgentFlowNode, OutputFlowNode } from "../../components/nodes/types";

export function createFlowNode(
  type: "agent",
  position: { x: number; y: number },
): AgentFlowNode;

export function createFlowNode(
  type: "output",
  position: { x: number; y: number },
): OutputFlowNode;

export function createFlowNode(
  type: AppFlowNode["type"],
  position: { x: number; y: number },
): AppFlowNode {
  const id = crypto.randomUUID();

  switch (type) {
    case "agent":
      return {
        id,
        type: "agent",
        position,
        data: {
          title: "Agent",
          description: "AI agent",
          config: {
            ...DEFAULT_AGENT_CONFIG,
          },
          metadata: {
            status: "idle",
            disabled: false,
            collapsed: false,
            locked: false,
          },
        },
      };

    case "output":
      return {
        id,
        type: "output",
        position,
        data: {
          title: "Output",
          description: "Workflow output",
          config: {
            output: "No output yet",
          },
          metadata: {
            status: "idle",
            disabled: false,
            collapsed: false,
            locked: false,
          },
        },
      };
    default:
      throw new Error(`Unsupported node type: ${type}`);
    // keep your other cases...
  }
}
