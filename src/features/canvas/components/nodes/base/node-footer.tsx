import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NodeFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const NodeFooter = ({ className, ...props }: NodeFooterProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t bg-muted/20 px-4 py-2",
        className,
      )}
      {...props}
    >
      <span className="text-xs text-muted-foreground">Ready</span>

      <span className="text-xs text-muted-foreground">v1</span>
    </div>
  );
};
