import { SandboxInstance, sandboxManager } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { SandboxFlowNode } from "../../components/nodes/types/sandbox-node";

import { ExecutionContextManager } from "./execution-context-manager";
import { executionEvents } from "./execution-events";
import { PublishNodeStatus } from "./graph-executor";

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
  publishNodeStatus: PublishNodeStatus,
): Promise<void> {
  contextManager.incrementNodesExecuted();

  const context = contextManager.getContext();

  const started = performance.now();

  if (!context.executionId) {
    throw new Error("No execution ID");
  }

  try {
    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: node.id,
      status: "running",
    });

    const sandbox = await sandboxManager.create(
      userId,
      node.data.config.credentials,
    );

    contextManager.setMetadata("sandboxId", sandbox.id);

    contextManager.setOutput(node.id, {
      type: "sandbox",
      sandboxId: sandbox.id,
    });

    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: node.id,
      status: "success",
    });
  } catch (error) {
    contextManager.incrementErrors();
    await publishNodeStatus({
      executionId: context.executionId,
      nodeId: node.id,
      status: "error",
    });
    throw error;
  }
}
