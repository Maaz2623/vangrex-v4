import { NodeProps, Position } from "@xyflow/react";
import { AgentFlowNode, AgentNodeData } from "../types";
import { BaseNode } from "../base/base-node";
import { NodeHeader } from "../base/node-header";
import { BotIcon, Copy, Play, Settings2, Trash2 } from "lucide-react";
import { NodeStatus } from "../base/node-status";
import { NodeBody } from "../base/node-body";
import { NodeFooter } from "../base/node-footer";
import { NodeToolbar } from "../base/node-toolbar";
import { NodeToolbarButton } from "../base/node-toolbar-button";
import { NodeShell } from "../base/node-shell";
import { toolDefinition } from "./tool-definition";
import { ToolFlowNode } from "../types/tool-node";
import { ToolNodePreview } from "./tool-node-preview";

export const ToolNode = ({ data, selected }: NodeProps<ToolFlowNode>) => {
  const Icon = toolDefinition.icon;

  return (
    <NodeShell
      definition={toolDefinition}
      data={data}
      selected={selected}
      preview={<ToolNodePreview data={data} />}
      toolbar={
        <>
          <NodeToolbarButton icon={Settings2} />

          <NodeToolbarButton icon={Play} />

          <NodeToolbarButton icon={Copy} />

          <NodeToolbarButton icon={Trash2} />
        </>
      }
    />
  );
};
