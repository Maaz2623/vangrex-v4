import { DEFAULT_AGENT_CONFIG } from "../../components/nodes/agent/defaults";
import { AppFlowNode } from "../../components/nodes/node-config";
import { AgentFlowNode, OutputFlowNode } from "../../components/nodes/types";

interface FlowPosition {
  x: number;
  y: number;
}

export function createFlowNode(
  type: "agent",
  position: FlowPosition,
): AgentFlowNode;

export function createFlowNode(
  type: "output",
  position: FlowPosition,
): OutputFlowNode;

export function createFlowNode(
  type: AppFlowNode["type"],
  position: FlowPosition,
): AppFlowNode;

export function createFlowNode(
  type: AppFlowNode["type"],
  position: FlowPosition,
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

    case "sandbox":
      return {
        id,
        type: "sandbox",
        position,
        data: {
          title: "Sandbox",
          description: "Sandbox Node",
          config: {
            credentials: [],
          },
          metadata: {
            status: "idle",
            disabled: false,
            collapsed: false,
            locked: false,
          },
        },
      };

    case "tool-call":
      return {
        id,
        type: "tool-call",
        position,
        data: {
          title: "Tool",
          description: "Tool Node",
          config: {
            implementation: "terminal",
            parameters: {},
          },
          metadata: {
            status: "idle",
            disabled: false,
            collapsed: false,
            locked: false,
          },
        },
      };

    case "variable":
      return {
        id,
        type: "variable",
        position,
        data: {
          title: "Variable",
          description: "Variable Node",
          config: {
            type: "text",
            description: "",
            secret: false,
            editable: false,
            global: false,
            name: "",
            value: "",
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
  }
}
