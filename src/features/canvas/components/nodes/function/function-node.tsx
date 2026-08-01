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
import { NodeHandle } from "../base/node-handle";
import { NodeToolbar } from "../base/node-toolbar";
import { NodeToolbarButton } from "../base/node-toolbar-button";
import { FunctionNodePreview } from "./function-node-preview";

export const FunctionNode = ({
  data,
  selected,
}: NodeProps<FunctionFlowNode>) => {
  return (
    <BaseNode selected={selected}>
      <NodeToolbar>
        <NodeToolbarButton icon={Settings2} />

        <NodeToolbarButton icon={Play} />

        <NodeToolbarButton icon={Copy} />

        <NodeToolbarButton icon={Trash2} />
      </NodeToolbar>

      <NodeHeader
        icon={<FunctionSquareIcon className="h-5 w-5" />}
        title={data.title}
        subtitle={"Function Node"}
        rightSection={<NodeStatus status={data.metadata.status} />}
      />

      <NodeBody>
        <FunctionNodePreview data={data} />
      </NodeBody>

      <NodeFooter
        left={
          <NodeHandle
            label="Output"
            id={`input`}
            type="target"
            position={Position.Left}
          />
        }
        right={
          <NodeHandle id={`output`} type="source" position={Position.Right} />
        }
      />
    </BaseNode>
  );
};
