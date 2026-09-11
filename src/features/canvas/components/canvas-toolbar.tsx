"use client";

import { Maximize2, Play } from "lucide-react";

import { useReactFlow } from "@xyflow/react";

import { Button } from "@/components/ui/button";

type CanvasToolbarProps = {
  isSaving?: boolean;
  disabled?: boolean;
  onRun: () => void;
};

export const CanvasToolbar = ({
  isSaving = false,
  disabled = false,
  onRun,
}: CanvasToolbarProps) => {
  const { fitView } = useReactFlow();

  return (
    <div className="pointer-events-auto flex h-12 items-center rounded-xl border border-zinc-800/80 bg-zinc-950/95 px-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      {/* Save status */}
      <div className="flex h-full items-center px-2.5">
        <span className="text-[10px] text-zinc-600">
          {isSaving ? "Saving..." : "Saved"}
        </span>
      </div>

      <ToolbarDivider />

      {/* Fit */}
      <button
        type="button"
        onClick={() =>
          fitView({
            padding: 0.2,
            duration: 500,
          })
        }
        className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700"
        title="Fit workflow to canvas"
      >
        <Maximize2 className="h-3.5 w-3.5" />

        <span className="hidden text-[10px] font-medium min-[900px]:inline">
          Fit
        </span>
      </button>

      <ToolbarDivider />

      {/* Run */}
      <Button
        type="button"
        onClick={onRun}
        disabled={disabled}
        className="h-9 min-w-[82px] rounded-lg bg-white px-3.5 text-[10px] font-semibold text-zinc-950 shadow-none hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/20"
      >
        <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
        Run
      </Button>
    </div>
  );
};

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-zinc-800/80" />;
}
