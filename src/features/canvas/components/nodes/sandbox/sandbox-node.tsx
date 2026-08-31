import { NodeProps } from "@xyflow/react";
import { Settings2, Copy, Trash2 } from "lucide-react";

import { SandboxFlowNode } from "../types/sandbox-node";
import { NodeShell } from "../base/node-shell";
import { NodeToolbarButton } from "../base/node-toolbar-button";
import { sandboxDefinition } from "./sandbox-definition";

export const SandboxNode = ({
  id,
  data,
  selected,
}: NodeProps<SandboxFlowNode>) => {
  return (
    <NodeShell
      definition={sandboxDefinition}
      data={data}
      selected={selected}
      preview={
        <div className="px-3 py-2 text-sm text-muted-foreground">
          Isolated execution environment
        </div>
      }
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
