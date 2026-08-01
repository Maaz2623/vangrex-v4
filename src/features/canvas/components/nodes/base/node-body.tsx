import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface NodeBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const NodeBody = ({ className, children, ...props }: NodeBodyProps) => {
  return (
    <div className={cn("flex flex-col gap-3 p-4", className)} {...props}>
      {children}
    </div>
  );
};
