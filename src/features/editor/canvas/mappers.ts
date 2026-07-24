import { FlowNode } from "./types";

export function dbNodeToFlowNode(node: any): FlowNode {
  return {
    id: node.id,
    type: node.type,

    position: {
      x: node.positionX,
      y: node.positionY,
    },

    data: {
      id: node.id,
      name: node.name,
      description: node.description,
      config: node.config,
    },
  };
}
