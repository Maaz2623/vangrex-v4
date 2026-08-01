import { Node } from "@xyflow/react";
import { BaseNodeData } from "./base-node";

export type FlowNode<TConfig, TType extends string> = Node<
  BaseNodeData<TConfig>,
  TType
>;
