"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useTRPC } from "@/trpc/client";
import { useExecutions } from "../hooks/use-executions";

type ExecutionStatusType =
  | "pending"
  | "running"
  | "success"
  | "error"
  | "cancelled";

interface ExecutionsViewProps {
  projectId: string;
  workflowId: string;
}

function formatDuration(
  startedAt: Date | string | null,
  completedAt: Date | string | null,
  now = Date.now(),
) {
  if (!startedAt) return "—";

  const start = new Date(startedAt).getTime();
  const end = completedAt ? new Date(completedAt).getTime() : now;

  const duration = Math.max(0, end - start);

  if (duration < 1000) {
    return `${duration}ms`;
  }

  return `${(duration / 1000).toFixed(1)}s`;
}

function formatDate(date: Date | string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function ExecutionsView({ projectId, workflowId }: ExecutionsViewProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: executions, isLoading, isError } = useExecutions(workflowId);

  // Used only to trigger a local rerender so running
  // execution durations update every second.
  const [now, setNow] = useState(() => Date.now());

  const hasRunningExecution = executions?.some(
    (execution) =>
      execution.status === "running" || execution.status === "pending",
  );

  /**
   * Local ticker.
   *
   * IMPORTANT:
   * This does NOT refetch anything.
   * It only updates `now`, causing the component to rerender
   * and therefore recalculate the displayed duration.
   */
  useEffect(() => {
    if (!hasRunningExecution) {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [hasRunningExecution]);

  /**
   * Realtime execution events.
   *
   * Actual execution data is refreshed when an event arrives.
   * The local ticker above is completely independent of this.
   */
  useSubscription(
    trpc.executions.events.subscriptionOptions(undefined, {
      onData(event) {
        if (!event.executionId) {
          return;
        }

        queryClient.invalidateQueries({
          queryKey: trpc.executions.list.queryKey({
            workflowId,
          }),
        });
      },
    }),
  );

  return (
    <div className="flex h-[85vh] w-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b px-6 py-5">
        <h1 className="text-lg font-semibold tracking-tight">Executions</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View workflow runs and their execution status.
        </p>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {/* Loading */}
        {isLoading && (
          <div className="flex h-32 items-center justify-center rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Loading executions...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="flex h-32 items-center justify-center rounded-lg border">
            <p className="text-sm text-destructive">
              Failed to load executions.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && !executions?.length && (
          <div className="flex h-32 items-center justify-center rounded-lg border">
            <p className="text-sm text-muted-foreground">No executions yet.</p>
          </div>
        )}

        {/* Executions */}
        {!isLoading && !isError && executions && executions.length > 0 && (
          <div className="overflow-hidden rounded-lg border bg-background">
            {/* Table header */}
            <div className="grid grid-cols-[minmax(240px,1fr)_120px_100px_180px_100px] border-b bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground">
              <div>Execution</div>
              <div>Status</div>
              <div>Nodes</div>
              <div>Started</div>
              <div>Duration</div>
            </div>

            {/* Rows */}
            {executions.map((execution) => (
              <button
                type="button"
                key={execution.id}
                onClick={() =>
                  router.push(
                    `/projects/${projectId}/workflows/${workflowId}/executions/${execution.id}`,
                  )
                }
                className="grid w-full grid-cols-[minmax(240px,1fr)_120px_100px_180px_100px] items-center border-b px-4 py-4 text-left text-sm transition-colors last:border-b-0 hover:bg-muted/30"
              >
                {/* Execution */}
                <div className="min-w-0">
                  <div className="font-mono text-xs">
                    {execution.id.slice(0, 8)}
                  </div>

                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    {execution.id}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={execution.status} />
                </div>

                {/* Nodes */}
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {execution.stats.successfulNodes}
                  </span>

                  <span className="mx-1">/</span>

                  {execution.stats.totalNodes}
                </div>

                {/* Started */}
                <div className="text-sm text-muted-foreground">
                  {formatDate(execution.startedAt)}
                </div>

                {/* Duration */}
                <div className="text-sm text-muted-foreground">
                  {formatDuration(
                    execution.startedAt,
                    execution.completedAt,
                    now,
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ExecutionStatusType }) {
  const config: Record<
    ExecutionStatusType,
    {
      label: string;
      dotClass: string;
      animate?: boolean;
    }
  > = {
    pending: {
      label: "Pending",
      dotClass: "bg-muted-foreground",
    },

    running: {
      label: "Running",
      dotClass: "bg-yellow-500",
      animate: true,
    },

    success: {
      label: "Success",
      dotClass: "bg-green-500",
    },

    error: {
      label: "Error",
      dotClass: "bg-red-500",
    },

    cancelled: {
      label: "Cancelled",
      dotClass: "bg-muted-foreground",
    },
  };

  const current = config[status];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium">
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          current.dotClass,
          current.animate && "animate-pulse",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {current.label}
    </span>
  );
}
