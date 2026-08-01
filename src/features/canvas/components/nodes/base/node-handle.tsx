import { cn } from "@/lib/utils";
import { Handle, HandleProps } from "@xyflow/react";

interface NodeHandleProps extends HandleProps {
  label?: string;
}

export const NodeHandle = ({ className, label, ...props }: NodeHandleProps) => {
  return (
    <Handle
      className={cn(
        "h-3! w-3! border-2! border-background! bg-primary! transition-all hover:scale-125! hover:bg-primary!",
        className,
      )}
      {...props}
    />
  );
};
