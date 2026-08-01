import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BaseNodeProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
}

export const BaseNode = ({
  selected,
  className,
  children,
  ...props
}: BaseNodeProps) => {
  return (
    <div
      className={cn(
        "w-80 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
        "hover:shadow-md",
        selected && "border-primary ring-2 ring-primary/20 shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
