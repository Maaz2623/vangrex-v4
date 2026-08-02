import { NodeProps, Position } from "@xyflow/react";
import { AgentFlowNode, AgentNodeData, FunctionFlowNode } from "../types";
import { BaseNode } from "../base/base-node";
import { NodeHeader } from "../base/node-header";
import {
  BotIcon,
  Copy,
  FunctionSquareIcon,
  Play,
  Settings2,
  Trash2,
} from "lucide-react";
import { NodeStatus } from "../base/node-status";
import { NodeBody } from "../base/node-body";
import { NodeFooter } from "../base/node-footer";
import { NodeToolbar } from "../base/node-toolbar";
import { NodeToolbarButton } from "../base/node-toolbar-button";
import { FunctionNodePreview } from "./function-node-preview";
import { NodeShell } from "../base/node-shell";
import { functionDefinition } from "./function-definition";

export const FunctionNode = ({
  data,
  selected,
}: NodeProps<FunctionFlowNode>) => {
  return (
    <NodeShell
      definition={functionDefinition}
      data={data}
      selected={selected}
      preview={<FunctionNodePreview data={data} />}
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
