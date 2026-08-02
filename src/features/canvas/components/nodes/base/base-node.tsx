import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { NodeHandle } from "../types/node-handle";
import { NodePorts } from "./node-ports";
import { NodeDefinition } from "../types/node-definition";

interface BaseNodeProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  definition: NodeDefinition<any>;
}

export const BaseNode = ({
  selected,
  className,
  children,
  definition,
  ...props
}: BaseNodeProps) => {
  return (
    <div
      className={cn(
        "group relative w-80 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg",
        selected && "border-primary ring-2 ring-primary/20 shadow-xl",
        className,
      )}
      {...props}
    >
      <NodePorts handles={definition.handles} />
      {children}
    </div>
  );
};
