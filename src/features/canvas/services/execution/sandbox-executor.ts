import { SandboxInstance, sandboxManager } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { SandboxFlowNode } from "../../components/nodes/types/sandbox-node";

import { ExecutionContextManager } from "./execution-context-manager";
import { executionEvents } from "./execution-events";

export interface SandboxOutput {
  type: "sandbox";
  sandboxId: string;
}

export async function executeSandbox(
  node: SandboxFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  contextManager: ExecutionContextManager,
  userId: string,
): Promise<void> {
  contextManager.incrementNodesExecuted();

  const started = performance.now();

  try {
    console.log("[sandbox] config:", node.data.config);
    console.log("[sandbox] envs:", node.data.config.credentials);

    const sandbox = await sandboxManager.create(
      userId,
      node.data.config.credentials,
    );

    contextManager.setMetadata("sandboxId", sandbox.id);

    contextManager.setOutput(node.id, {
      type: "sandbox",
      sandboxId: sandbox.id,
    });
  } catch (error) {
    contextManager.incrementErrors();

    throw error;
  }
}
