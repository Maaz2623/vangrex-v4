import { NodeProps } from "@xyflow/react";
import { Copy, Settings2, Trash2 } from "lucide-react";

import { NodeShell } from "../base/node-shell";
import { NodeToolbarButton } from "../base/node-toolbar-button";

import { VariableFlowNode } from "../types/variable-node";
import { variableDefinition } from "./variable-definition";
import { VariableNodePreview } from "./variable-node-preview";
import { useNodeSettingsStore } from "@/features/canvas/store/node-settings-store";
import { useDeleteNode } from "@/features/canvas/hooks/node.hooks";

export const VariableNode = ({
  id,
  data,
  selected,
}: NodeProps<VariableFlowNode>) => {
  const { open } = useNodeSettingsStore();

  const deleteNode = useDeleteNode();

  return (
    <NodeShell
      definition={variableDefinition}
      data={data}
      selected={selected}
      preview={<VariableNodePreview data={data} />}
      toolbar={
        <>
          <NodeToolbarButton icon={Settings2} onClick={() => open(id)} />

          <NodeToolbarButton icon={Copy} />

          <NodeToolbarButton
            icon={Trash2}
            onClick={() =>
              deleteNode.mutate({
                id: id,
              })
            }
          />
        </>
      }
    />
  );
};
