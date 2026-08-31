import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export interface SandboxCredential {
  key: string;
  credentialId: string;
}

export interface SandboxConfig extends NodeConfig {
  credentials: SandboxCredential[];
}

export type SandboxNodeData = BaseNodeData<SandboxConfig>;

export type SandboxFlowNode = FlowNode<SandboxConfig, "sandbox">;
