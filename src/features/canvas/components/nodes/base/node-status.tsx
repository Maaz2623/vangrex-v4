import { cn } from "@/lib/utils";
import { NodeStatusType } from "../types";

interface NodeStatusProps {
  status?: NodeStatusType;
}

const variants: Record<NodeStatusType, string> = {
  idle: "bg-muted-foreground",
  running: "bg-blue-500 animate-pulse",
  success: "bg-green-500",
  error: "bg-red-500",
  disabled: "bg-zinc-400",
};

export const NodeStatus = ({ status = "idle" }: NodeStatusProps) => {
  return (
    <div
      className={cn(
        "h-2.5 w-2.5 rounded-full ring-2 ring-background",
        variants[status],
      )}
    />
  );
};
