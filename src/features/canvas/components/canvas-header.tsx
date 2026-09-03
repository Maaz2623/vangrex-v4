"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetWorkflow } from "@/features/workflows/hooks/use-workflows";
import { AlertCircle, Check, Loader2, Play } from "lucide-react";
import { useCanvasStore } from "../store/canvas-store";
import { useExecutionStore } from "../store/execution-store";

type Props = {
  projectId: string;
  workflowId: string;
};

export const CanvasHeader = ({ projectId, workflowId }: Props) => {
  const { setExecuteWorkflow, executionStatus } = useCanvasStore();

  const { data: workflow, isLoading } = useGetWorkflow({
    projectId,
    workflowId,
  });

  const nodeStates = useExecutionStore((state) => state.nodeStates);

  if (isLoading || !workflow) {
    return <CanvasHeaderSkeleton />;
  }

  const statuses = Object.values(nodeStates);

  const completedCount = statuses.filter(
    (status) => status === "success",
  ).length;

  const runningCount = statuses.filter((status) => status === "running").length;

  const pendingCount = statuses.filter((status) => status === "idle").length;

  const isRunning =
    executionStatus === "starting" || executionStatus === "running";

  const handleRun = () => {
    if (isRunning) return;

    setExecuteWorkflow(true);
  };

  return (
    <header className="w-[95%] rounded-xl bg-transparent">
      <div className="flex flex-col gap-5 px-4 lg:flex-row lg:items-center lg:justify-between">
        <div />

        <div className="flex items-center gap-3">
          {executionStatus === "running" && (
            <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
              <span>✓ {completedCount} completed</span>

              {runningCount > 0 && <span>⟳ {runningCount} running</span>}

              {pendingCount > 0 && <span>○ {pendingCount} pending</span>}
            </div>
          )}

          <Button onClick={handleRun} disabled={isRunning}>
            {executionStatus === "starting" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {executionStatus === "running" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {executionStatus === "success" && (
              <Check className="mr-2 h-4 w-4" />
            )}

            {executionStatus === "error" && (
              <AlertCircle className="mr-2 h-4 w-4" />
            )}

            {executionStatus === "idle" && <Play className="mr-2 h-4 w-4" />}

            {executionStatus === "starting" && "Starting..."}

            {executionStatus === "running" && "Running..."}

            {executionStatus === "success" && "Completed"}

            {executionStatus === "error" && "Failed"}

            {executionStatus === "idle" && "Run"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export const CanvasHeaderSkeleton = () => {
  return (
    <header className="w-[95%] bg-transparent">
      <div className="flex flex-col gap-5 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          <div className="mt-2">
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </header>
  );
};
