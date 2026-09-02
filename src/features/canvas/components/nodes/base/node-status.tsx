import { cn } from "@/lib/utils";

import { NodeStatusType } from "../types";

interface NodeStatusProps {
  status?: NodeStatusType;
}

const variants: Record<
  NodeStatusType,
  {
    dot: string;
    ring: string;
    glow: string;
  }
> = {
  idle: {
    dot: "bg-muted-foreground",
    ring: "ring-muted-foreground/10",
    glow: "",
  },

  running: {
    dot: "bg-blue-500",
    ring: "ring-blue-500/20",
    glow: "shadow-[0_0_8px_rgba(59,130,246,0.8)]",
  },

  success: {
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/20",
    glow: "shadow-[0_0_7px_rgba(16,185,129,0.6)]",
  },

  error: {
    dot: "bg-red-500",
    ring: "ring-red-500/20",
    glow: "shadow-[0_0_7px_rgba(239,68,68,0.6)]",
  },

  disabled: {
    dot: "bg-zinc-400",
    ring: "ring-zinc-400/10",
    glow: "",
  },
};

export const NodeStatus = ({ status = "idle" }: NodeStatusProps) => {
  const variant = variants[status];

  return (
    <span className={cn("relative flex h-3 w-3 items-center justify-center")}>
      {/* Pulse ring */}
      {status === "running" && (
        <span
          className="
            absolute
            inset-0
            animate-ping
            rounded-full
            bg-blue-500/40
          "
        />
      )}

      {/* Outer ring */}
      <span
        className={cn("absolute h-3 w-3 rounded-full ring-2", variant.ring)}
      />

      {/* Status dot */}
      <span
        className={cn(
          "relative h-2 w-2 rounded-full",
          variant.dot,
          variant.glow,
        )}
      />
    </span>
  );
};
