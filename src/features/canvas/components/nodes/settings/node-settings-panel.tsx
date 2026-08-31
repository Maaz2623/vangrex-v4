import { AgentSettings } from "../agent/agent-settings";
import { AppFlowNode } from "../node-config";
import { SandboxSettings } from "../sandbox/sandbox-settings";
import { ToolSettings } from "../tool/tool-settings";
import { AgentFlowNode, GithubFlowNode, VariableFlowNode } from "../types";
import { SandboxFlowNode } from "../types/sandbox-node";
import { ToolFlowNode } from "../types/tool-node";
import { VariableSettings } from "../variable/variable-settings";

interface NodeSettingsPanelProps {
  node: AppFlowNode | null;
  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
  workflowId: string;
  projectId: string;
}

export function NodeSettingsPanel({
  node,
  updateNode,
  workflowId,
  projectId,
}: NodeSettingsPanelProps) {
  if (!node) return null;

  switch (node.type) {
    case "agent":
      return (
        <AgentSettings node={node as AgentFlowNode} updateNode={updateNode} />
      );

    case "variable":
      return (
        <VariableSettings
          node={node as VariableFlowNode}
          updateNode={updateNode}
        />
      );

    case "tool-call":
      return (
        <ToolSettings node={node as ToolFlowNode} updateNode={updateNode} />
      );

    case "sandbox":
      return (
        <SandboxSettings
          node={node as SandboxFlowNode}
          updateNode={updateNode}
        />
      );

    default:
      return <div className="p-6">No settings available.</div>;
  }
}
