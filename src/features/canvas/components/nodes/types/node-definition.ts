import { NodeProps } from "@xyflow/react";
import { ComponentType } from "react";
import { FlowNode } from "./flow-node";
import { LucideIcon } from "lucide-react";
import { NodeHandle } from "./node-handle";

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
  component: ComponentType<any>;

  handles: NodeHandle[];

  /**
   * Default configuration.
   */
  defaultConfig: TConfig;

  /**
   * Sidebar category.
   */
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
