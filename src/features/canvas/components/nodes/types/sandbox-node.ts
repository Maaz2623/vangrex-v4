import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export interface SandboxConfig extends NodeConfig {
  provider: "e2b";
}

export type SandboxNodeData = BaseNodeData<SandboxConfig>;

export type SandboxFlowNode = FlowNode<SandboxConfig, "sandbox">;


