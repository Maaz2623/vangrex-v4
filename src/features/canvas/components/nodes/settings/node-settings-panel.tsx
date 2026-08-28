import { AgentSettings } from "../agent/agent-settings";
import { GitHubSettings } from "../github/github-settings";
import { AppFlowNode } from "../node-config";
import { ToolSettings } from "../tool/tool-settings";
import { AgentFlowNode, GithubFlowNode, VariableFlowNode } from "../types";
import { ToolFlowNode } from "../types/tool-node";
import { VariableSettings } from "../variable/variable-settings";

interface NodeSettingsPanelProps {
  node: AppFlowNode | null;
  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
  workflowId: string;
  projectId: string
}

export function NodeSettingsPanel({
  node,
  updateNode,
  workflowId,
  projectId
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

    case "github":
      return (
        <GitHubSettings
          workflowId={workflowId}
          node={node as GithubFlowNode}
          updateNode={updateNode}
          projectId={projectId}
        />
      );

    default:
      return <div className="p-6">No settings available.</div>;
  }
}
