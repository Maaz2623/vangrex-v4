import { useNodeSettingsStore } from "@/features/canvas/store/node-settings-store";
import { AppFlowNode } from "../node-config";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NodeSettingsPanel } from "./node-settings-panel";

interface NodeSettingsSheetProps {
  node: AppFlowNode | null;
  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
}

export const NodeSettingsSheet = ({
  node,
  updateNode,
}: NodeSettingsSheetProps) => {
  const { close } = useNodeSettingsStore();

  return (
    <Sheet
      open={!!node}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      <SheetContent side="right">
        <NodeSettingsPanel updateNode={updateNode} node={node} />
      </SheetContent>
    </Sheet>
  );
};
