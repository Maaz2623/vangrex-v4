import { NodeProps, Position } from "@xyflow/react";
import { AgentFlowNode, AgentNodeData } from "../types";
import { BaseNode } from "../base/base-node";
import { NodeHeader } from "../base/node-header";
import { BotIcon } from "lucide-react";
import { NodeStatus } from "../base/node-status";
import { NodeBody } from "../base/node-body";
import { AgentNodePreview } from "./agent-node-preview";
import { NodeFooter } from "../base/node-footer";
import { NodeHandle } from "../base/node-handle";

export const AgentNode = ({ data, selected }: NodeProps<AgentFlowNode>) => {
  return (
    <BaseNode selected={selected}>
      <NodeHeader
        icon={<BotIcon className="h-5 w-5" />}
        title={data.title}
        subtitle={"AI Agent"}
        rightSection={<NodeStatus status={data.status} />}
      />

      <NodeBody>
        <AgentNodePreview data={data} />
      </NodeBody>

      <NodeFooter
        left={
          <NodeHandle id={`input`} type="target" position={Position.Left} />
        }
        right={
          <NodeHandle id={`output`} type="source" position={Position.Right} />
        }
      />
    </BaseNode>
  );
};
