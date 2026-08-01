import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface NodeFooterProps extends HTMLAttributes<HTMLDivElement> {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export const NodeFooter = ({
  left,
  center,
  right,
  className,
  ...props
}: NodeFooterProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t px-4 py-3",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">{left}</div>

      <div className="flex items-center gap-2">{center}</div>

      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
};
