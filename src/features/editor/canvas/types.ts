import { Node } from "@xyflow/react";

import { NodeConfig } from "@/node.config";

export type FlowNodeData = {
  id: string;
  name: string;
  description: string;
  config: NodeConfig;
};

export type FlowNode = Node<FlowNodeData>;
