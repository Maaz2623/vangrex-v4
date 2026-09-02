import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import { NodeDefinition } from "../types/node-definition";
import { NodeStatusType } from "../types";
import { NodePorts } from "./node-ports";

interface BaseNodeProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  definition: NodeDefinition<any>;
  status?: NodeStatusType;
}

const statusVariants: Record<NodeStatusType, string> = {
  idle: "border-border",

  running: "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.25)]",

  success: "border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.22)]",

  error: "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.22)]",

  disabled: "border-zinc-400/50 opacity-60",
};

export const BaseNode = ({
  selected,
  className,
  children,
  definition,
  status = "idle",
  ...props
}: BaseNodeProps) => {
  return (
    <div
      className={cn(
        "group relative w-80 overflow-visible rounded-xl border bg-card text-card-foreground",
        "transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg",

        statusVariants[status],

        selected && "ring-2 ring-primary/20 shadow-xl",

        className,
      )}
      {...props}
    >
      <NodePorts handles={definition.handles} />

      {children}
    </div>
  );
};
