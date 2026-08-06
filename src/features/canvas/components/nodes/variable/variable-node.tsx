import { NodeProps } from "@xyflow/react";
import { Copy, Settings2, Trash2 } from "lucide-react";

import { NodeShell } from "../base/node-shell";
import { NodeToolbarButton } from "../base/node-toolbar-button";

import { VariableFlowNode } from "../types/variable-node";
import { variableDefinition } from "./variable-definition";
import { VariableNodePreview } from "./variable-node-preview";

export const VariableNode = ({
  data,
  selected,
}: NodeProps<VariableFlowNode>) => {
  return (
    <NodeShell
      definition={variableDefinition}
      data={data}
      selected={selected}
      preview={<VariableNodePreview data={data} />}
      toolbar={
        <>
          <NodeToolbarButton icon={Settings2} />

          <NodeToolbarButton icon={Copy} />

          <NodeToolbarButton icon={Trash2} />
        </>
      }
    />
  );
};
