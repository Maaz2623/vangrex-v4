import { ToolImplementation } from "@/features/canvas/services/tools/tool-implementation";
import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export interface ToolConfig extends NodeConfig {
  implementation: ToolImplementation;
  parameters: Record<string, unknown>;
}

export type ToolNodeData = BaseNodeData<ToolConfig>;

export type ToolFlowNode = FlowNode<ToolConfig, "tool-call">;
