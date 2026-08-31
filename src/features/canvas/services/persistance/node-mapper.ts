import { AppFlowNode } from "../../components/nodes/node-config";

type NodeType = AppFlowNode["type"];

type DbNode = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  positionX: number;
  positionY: number;
  config: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

const NODE_TYPES = [
  "tool-call",
  "agent",
  "variable",
  "output",
  "sandbox",
] as const satisfies readonly NodeType[];

function isNodeType(value: string): value is NodeType {
  return NODE_TYPES.includes(value as NodeType);
}

export function dbNodeToFlowNode(node: DbNode): AppFlowNode {
  if (!isNodeType(node.type)) {
    throw new Error(`Invalid node type: ${node.type}`);
  }

  return {
    id: node.id,

    type: node.type,

    position: {
      x: node.positionX,
      y: node.positionY,
    },

    data: {
      title: node.title,
      description: node.description ?? "",

      config: node.config as AppFlowNode["data"]["config"],

      metadata: node.metadata as AppFlowNode["data"]["metadata"],
    },
  } as AppFlowNode;
}
