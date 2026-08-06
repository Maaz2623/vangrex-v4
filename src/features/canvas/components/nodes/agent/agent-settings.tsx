import { AppFlowNode } from "../node-config";

interface AgentSettingsProps {
  node: AppFlowNode;
  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
}

export const AgentSettings = ({ node, updateNode }: AgentSettingsProps) => {
  return <div>Agent settings</div>;
};
