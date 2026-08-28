import { useNodeSettingsStore } from "@/features/canvas/store/node-settings-store";
import { AppFlowNode } from "../node-config";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NodeSettingsPanel } from "./node-settings-panel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NodeSettingsSheetProps {
  node: AppFlowNode | null;
  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
  workflowId: string;
  projectId: string;
}

export const NodeSettingsSheet = ({
  node,
  updateNode,
  workflowId,
  projectId,
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
        <ScrollArea className="max-h-screen">
          <NodeSettingsPanel
            projectId={projectId}
            workflowId={workflowId}
            updateNode={updateNode}
            node={node}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
