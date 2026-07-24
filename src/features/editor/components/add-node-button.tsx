"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Brain,
  CheckIcon,
  GitBranch,
  Package,
  PlusIcon,
  User,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAddNode } from "@/features/nodes/hooks/use-node";

type NodeType = "agent" | "tool" | "knowledge" | "logic" | "workflow" | "human";

const NODE_TYPES: {
  id: NodeType;
  name: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "agent",
    name: "AI Worker",
    description: "Autonomous AI agent",
    icon: Bot,
  },
  {
    id: "tool",
    name: "Tool",
    description: "External tools & integrations",
    icon: Wrench,
  },
  {
    id: "knowledge",
    name: "Knowledge",
    description: "Memory, documents, databases",
    icon: Brain,
  },
  {
    id: "logic",
    name: "Logic",
    description: "Conditions, loops & branching",
    icon: GitBranch,
  },
  {
    id: "workflow",
    name: "Workflow",
    description: "Nested workflow",
    icon: Package,
  },
  {
    id: "human",
    name: "Human Task",
    description: "Manual approval",
    icon: User,
  },
];

const DEFAULT_NODE = NODE_TYPES[0];

export const AddNodeButton = ({ projectId }: { projectId: string }) => {
  const addNode = useAddNode(projectId);

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<NodeType>(DEFAULT_NODE.id);
  const [name, setName] = useState(DEFAULT_NODE.name);
  const [description, setDescription] = useState("");

  const reset = () => {
    setType(DEFAULT_NODE.id);
    setName(DEFAULT_NODE.name);
    setDescription("");
  };

  const createNode = () => {
    addNode.mutate(
      {
        projectId,
        type,
        name: name.trim(),
        description: description.trim(),
      },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    );
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="absolute top-10 right-10 z-50"
      >
        <PlusIcon className="size-4" />
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Node</DialogTitle>
            <DialogDescription>Create a new workflow node.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div>
              <p className="mb-3 text-sm font-medium">Node Type</p>

              <div className="grid grid-cols-3 gap-2">
                {NODE_TYPES.map((node) => {
                  const Icon = node.icon;
                  const selected = type === node.id;

                  return (
                    <Card
                      key={node.id}
                      onClick={() => {
                        const previous = NODE_TYPES.find((n) => n.id === type);

                        setType(node.id);

                        if (!name || name === previous?.name) {
                          setName(node.name);
                        }
                      }}
                      className={cn(
                        "relative cursor-pointer p-3 transition-all hover:border-primary hover:bg-accent/40",
                        selected &&
                          "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500",
                      )}
                    >
                      {selected && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center">
                          <CheckIcon className="h-3 w-3 text-emerald-500" />
                        </div>
                      )}

                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="text-sm font-medium">{node.name}</h3>

                      <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">
                        {node.description}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Backend Engineer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>

              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              disabled={addNode.isPending}
            >
              Cancel
            </Button>

            <Button
              onClick={createNode}
              disabled={!name.trim() || addNode.isPending}
            >
              {addNode.isPending ? "Creating..." : "Create Node"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
