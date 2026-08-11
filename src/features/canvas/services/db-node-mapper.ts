import { AppFlowNode } from "../components/nodes/node-config";
import { AgentConfig, OutputConfig, VariableConfig } from "../components/nodes/types";
import { ToolConfig } from "../components/nodes/types/tool-node";

type DbNode = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  positionX: number;
  positionY: number;
  config: Record<string, unknown>;
  metadata: {
    disabled?: boolean;
    collapsed?: boolean;
    locked?: boolean;
    status?: string;
  } | null;
};

export function mapDbNodeToAppFlowNode(node: DbNode): AppFlowNode {
  const metadata = node.metadata ?? {};

  const data = {
    title: node.title,
    description: node.description ?? undefined,
    metadata: {
      disabled: metadata.disabled ?? false,
      collapsed: metadata.collapsed ?? false,
      locked: metadata.locked ?? false,
    },
  };

  switch (node.type) {
    case "agent":
      return {
        id: node.id,
        type: "agent",
        position: {
          x: node.positionX,
          y: node.positionY,
        },
        data: {
          ...data,
          config: node.config as AgentConfig,
        },
      };

    case "tool-call":
      return {
        id: node.id,
        type: "tool-call",
        position: {
          x: node.positionX,
          y: node.positionY,
        },
        data: {
          ...data,
          config: node.config as ToolConfig,
        },
      };

    case "variable":
      return {
        id: node.id,
        type: "variable",
        position: {
          x: node.positionX,
          y: node.positionY,
        },
        data: {
          ...data,
          config: node.config as VariableConfig,
        },
      };

    case "output":
      return {
        id: node.id,
        type: "output",
        position: {
          x: node.positionX,
          y: node.positionY,
        },
        data: {
          ...data,
          config: node.config as OutputConfig,
        },
      };

    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}
