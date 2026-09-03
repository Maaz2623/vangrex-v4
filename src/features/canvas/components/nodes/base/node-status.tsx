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
    dot: "bg-blue-400",
    ring: "ring-blue-500/20",
    glow: "shadow-[0_0_8px_rgba(59,130,246,0.85)]",
  },

  success: {
    dot: "bg-emerald-400",
    ring: "ring-emerald-500/20",
    glow: "shadow-[0_0_8px_rgba(16,185,129,0.7)]",
  },

  error: {
    dot: "bg-red-400",
    ring: "ring-red-500/20",
    glow: "shadow-[0_0_8px_rgba(239,68,68,0.7)]",
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
    <span
      className={cn(
        "relative flex size-3 items-center justify-center",
        "shrink-0",
      )}
    >
      {/* Running execution ring */}
      {status === "running" && (
        <>
          <span
            className="
              absolute
              -inset-[3px]
              rounded-full
              border
              border-blue-500/20
            "
          />

          <span
            className="
              absolute
              -inset-[3px]
              rounded-full
              border
              border-transparent
              border-t-blue-400
              border-r-blue-400/60
              animate-spin
            "
            style={{
              animationDuration: "1.2s",
            }}
          />

          {/* Very subtle ambient glow */}
          <span
            className="
              absolute
              -inset-1
              rounded-full
              bg-blue-500/10
              blur-[3px]
            "
          />
        </>
      )}

      {/* Success completion ring */}
      {status === "success" && (
        <span
          className="
            absolute
            -inset-[2px]
            rounded-full
            border
            border-emerald-400/40
            animate-[status-success_500ms_ease-out]
          "
        />
      )}

      {/* Error ring */}
      {status === "error" && (
        <span
          className="
            absolute
            -inset-[2px]
            rounded-full
            border
            border-red-400/40
            animate-[status-error_500ms_ease-out]
          "
        />
      )}

      {/* Outer status ring */}
      <span
        className={cn("absolute size-3 rounded-full ring-2", variant.ring)}
      />

      {/* Status core */}
      <span
        className={cn(
          "relative size-2 rounded-full",
          "transition-all duration-200",
          variant.dot,
          variant.glow,
        )}
      />
    </span>
  );
};
