import { AgentSettings } from "../agent/agent-settings";
import { AppFlowNode } from "../node-config";
import { ToolSettings } from "../tool/tool-settings";
import { AgentFlowNode, VariableFlowNode } from "../types";
import { ToolFlowNode } from "../types/tool-node";
import { VariableSettings } from "../variable/variable-settings";

interface NodeSettingsPanelProps {
  node: AppFlowNode | null;
  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
}

export function NodeSettingsPanel({
  node,
  updateNode,
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

    default:
      return <div className="p-6">No settings available.</div>;
  }
}
