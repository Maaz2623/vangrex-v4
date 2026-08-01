import { NodeProps } from "@xyflow/react";
import { ComponentType } from "react";
import { FlowNode } from "./flow-node";
import { LucideIcon } from "lucide-react";

export interface NodeDefinition<TConfig> {
  /**
   * Unique node type.
   * Must match React Flow's node.type.
   */
  type: string;

  /**
   * Display name.
   */
  name: string;

  /**
   * Optional description.
   */
  description?: string;

  /**
   * Sidebar icon.
   */
  icon: LucideIcon;

  /**
   * React Flow component.
   */
  component: ComponentType<NodeProps<FlowNode<TConfig>>>;

  /**
   * Default configuration.
   */
  defaultConfig: TConfig;

  /**
   * Sidebar category.
   */
  category: "AI" | "Logic" | "Data" | "Flow" | "Tools" | "Input" | "Output";
}

export const NodeCategory = {
  AI: "AI",
  Logic: "Logic",
  Data: "Data",
  Flow: "Flow",
  Tools: "Tools",
  Input: "Input",
  Output: "Output",
} as const;

export type NodeCategory = (typeof NodeCategory)[keyof typeof NodeCategory];
