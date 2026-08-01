import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NodeToolbarProps {
  children: ReactNode;
  className?: string;
}

export const NodeToolbar = ({ children, className }: NodeToolbarProps) => {
  return (
    <div
      className={cn(
        "absolute right-3 top-3 z-10",
        "opacity-0 transition-all duration-200",
        "translate-y-1",
        "group-hover:translate-y-0",
        "group-hover:opacity-100",
        className,
      )}
    >
      <div className="flex items-center gap-1 rounded-lg border bg-background/95 p-1 shadow-lg backdrop-blur">
        {children}
      </div>
    </div>
  );
};
