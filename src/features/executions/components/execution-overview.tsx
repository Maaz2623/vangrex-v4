"use client";

import { useTRPC } from "@/trpc/client";
import { useExecutions } from "../hooks/use-executions";
import { useQueryClient } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";

interface ExecutionsViewProps {
  projectId: string;
  workflowId: string;
}

function formatDuration(
  startedAt: Date | string | null,
  completedAt: Date | string | null,
) {
  if (!startedAt) {
    return "—";
  }

  const start = new Date(startedAt).getTime();

  // For running executions, calculate duration until now.
  if (!completedAt) {
    const duration = Date.now() - start;

    if (duration < 1000) {
      return `${duration}ms`;
    }

    return `${(duration / 1000).toFixed(1)}s`;
  }

  const duration = new Date(completedAt).getTime() - start;

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

  const { data: executions, isLoading, isError } = useExecutions(workflowId);

  return (
    <div className="flex flex-col h-[85vh]">
      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}

      <div className="border-b px-6 py-5">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Executions</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View workflow runs and their execution status.
          </p>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* CONTENT */}
      {/* -------------------------------------------------- */}

      <div className="flex-1 overflow-auto p-6">
        {/* Loading */}

        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-sm text-muted-foreground">
              Loading executions...
            </div>
          </div>
        )}

        {/* Error */}

        {!isLoading && isError && (
          <div className="flex h-64 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="text-center">
              <p className="font-medium text-destructive">
                Failed to load executions
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Something went wrong while loading workflow executions.
              </p>
            </div>
          </div>
        )}

        {/* Empty */}

        {!isLoading && !isError && !executions?.length && (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="font-medium">No executions yet</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Run this workflow to see executions here.
              </p>
            </div>
          </div>
        )}

        {/* Executions */}

        {!isLoading && !isError && executions && executions.length > 0 && (
          <div className="overflow-hidden rounded-lg border bg-background">
            {/* -------------------------------------------------- */}
            {/* TABLE HEADER */}
            {/* -------------------------------------------------- */}

            <div className="grid grid-cols-[minmax(240px,1fr)_120px_100px_180px_100px] border-b bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground">
              <div>Execution</div>

              <div>Status</div>

              <div>Nodes</div>

              <div>Started</div>

              <div>Duration</div>
            </div>

            {/* -------------------------------------------------- */}
            {/* ROWS */}
            {/* -------------------------------------------------- */}

            {executions.map((execution) => (
              <div
                key={execution.id}
                className="grid grid-cols-[minmax(240px,1fr)_120px_100px_180px_100px] items-center border-b px-4 py-4 text-sm transition-colors last:border-b-0 hover:bg-muted/30"
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
                  {formatDuration(execution.startedAt, execution.completedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* STATUS BADGE */
/* -------------------------------------------------- */

function StatusBadge({ status }: { status: string }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  const dotClass = {
    success: "bg-green-500",
    error: "bg-red-500",
    running: "bg-yellow-500",
    pending: "bg-muted-foreground",
    skipped: "bg-muted-foreground",
  }[status];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium">
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          dotClass ?? "bg-muted-foreground",
          status === "running" && "animate-pulse",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {label}
    </span>
  );
}
