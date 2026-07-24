import { Bot, Trash2Icon } from "lucide-react";
import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { Badge } from "@/components/ui/badge";
import { FlowNode } from "../canvas/types";
import { AgentConfig } from "@/node.config";
import { Button } from "@/components/ui/button";
import { useDeleteNode } from "@/features/nodes/hooks/use-node";

type AgentFlowNode = FlowNode<AgentConfig, "agent">;

export const AgentNode = ({ data }: NodeProps<AgentFlowNode>) => {
  const deleteNode = useDeleteNode();

  return (
    <BaseNode
      icon={<Bot className="size-5 text-blue-500" />}
      title={data.name}
      description={data.description}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-md">
            {data.config.provider || "No Provider"}
          </Badge>

          <Badge variant="outline" className="rounded-md">
            {data.config.model || "No Model"}
          </Badge>
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              // delete mutation
              deleteNode.mutate({
                id: data.id,
              });
            }}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </div>
    </BaseNode>
  );
};
