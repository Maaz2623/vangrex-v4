import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NodeFooterProps extends HTMLAttributes<HTMLDivElement> {
  left?: ReactNode;
  right?: ReactNode;
}

export const NodeFooter = ({
  left,
  right,
  className,
  ...props
}: NodeFooterProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t bg-muted/20 px-4 py-2",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {left}

        <span className="text-xs text-muted-foreground">Input</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Output</span>

        {right}
      </div>
    </div>
  );
};
