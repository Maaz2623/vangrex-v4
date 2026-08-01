import { Node } from "@xyflow/react";
import { BaseNodeData } from "./base-node";

export type FlowNode<Tconfig = unknown> = Node<BaseNodeData<Tconfig>>;
