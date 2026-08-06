import { NodeProps, Position } from "@xyflow/react";
import { AgentFlowNode, AgentNodeData } from "../types";
import { BaseNode } from "../base/base-node";
import { NodeHeader } from "../base/node-header";
import { BotIcon, Copy, Play, Settings2, Trash2 } from "lucide-react";
import { NodeStatus } from "../base/node-status";
import { NodeBody } from "../base/node-body";
import { AgentNodePreview } from "./agent-node-preview";
import { NodeFooter } from "../base/node-footer";
import { NodeToolbar } from "../base/node-toolbar";
import { NodeToolbarButton } from "../base/node-toolbar-button";
import { agentDefinition } from "./agent-definition";
import { NodeShell } from "../base/node-shell";
import { useCanvasStore } from "@/features/canvas/store/canvas-store";
import { useNodeSettingsStore } from "@/features/canvas/store/node-settings-store";

export const AgentNode = ({ id, data, selected }: NodeProps<AgentFlowNode>) => {
  const { setExecuteAgentId } = useCanvasStore();

  const { open } = useNodeSettingsStore();

  return (
    <NodeShell
      definition={agentDefinition}
      data={data}
      selected={selected}
      preview={<AgentNodePreview data={data} />}
      toolbar={
        <>
          <NodeToolbarButton icon={Settings2} onClick={() => open(id)} />

          <NodeToolbarButton
            icon={Play}
            onClick={() => {
              setExecuteAgentId(id);
            }}
          />

          <NodeToolbarButton icon={Copy} />

          <NodeToolbarButton icon={Trash2} />
        </>
      }
    />
  );
};
