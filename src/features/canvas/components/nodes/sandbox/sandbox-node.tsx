import { NodeProps } from "@xyflow/react";
import { Settings2, Copy, Trash2 } from "lucide-react";

import { SandboxFlowNode } from "../types/sandbox-node";
import { NodeShell } from "../base/node-shell";
import { NodeToolbarButton } from "../base/node-toolbar-button";
import { sandboxDefinition } from "./sandbox-definition";
import { SandboxNodePreview } from "./sandbox-node-preview";
import { useNodeSettingsStore } from "@/features/canvas/store/node-settings-store";

export const SandboxNode = ({
  id,
  data,
  selected,
}: NodeProps<SandboxFlowNode>) => {
  const { open } = useNodeSettingsStore();

  return (
    <NodeShell
      definition={sandboxDefinition}
      data={data}
      selected={selected}
      preview={<SandboxNodePreview data={data} />}
      toolbar={
        <>
          <NodeToolbarButton icon={Settings2} onClick={() => open(id)} />
          <NodeToolbarButton icon={Copy} />
          <NodeToolbarButton icon={Trash2} />
        </>
      }
    />
  );
};
