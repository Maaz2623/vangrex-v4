"use client";

import { useMemo } from "react";

import { NodeStatusType } from "@/features/canvas/components/nodes/types";
import { useExecution } from "../hooks/use-executions";

interface ExecutionViewProps {
  projectId: string;
  workflowId: string;
  executionId: string;
}

type ExecutionStatusType =
  | "pending"
  | "running"
  | "success"
  | "error"
  | "cancelled";

export function ExecutionView({
  projectId,
  workflowId,
  executionId,
}: ExecutionViewProps) {
  const {
    data: execution,
    isLoading,
    isError,
    error,
  } = useExecution(executionId);

  const duration = useMemo(() => {
    if (!execution?.startedAt) {
      return null;
    }

    const start = new Date(execution.startedAt).getTime();

    const end = execution.completedAt
      ? new Date(execution.completedAt).getTime()
      : Date.now();

    const durationMs = Math.max(0, end - start);

    if (durationMs < 1000) {
      return `${durationMs}ms`;
    }

    return `${(durationMs / 1000).toFixed(2)}s`;
  }, [execution?.startedAt, execution?.completedAt]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading execution...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-sm font-medium">Failed to load execution</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {error?.message ??
              "Something went wrong while loading this execution."}
          </p>
        </div>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Execution not found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="truncate text-lg font-semibold">Execution</h1>

              <ExecutionStatus status={execution.status} />
            </div>

            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
              {execution.id}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-6 text-sm">
            <ExecutionStat
              label="Nodes"
              value={String(execution.nodes?.length ?? 0)}
            />

            <ExecutionStat label="Duration" value={duration ?? "—"} />

            {execution.sandboxId && (
              <ExecutionStat label="Sandbox" value={execution.sandboxId} />
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-h-0 flex-1">
        {/* Execution nodes */}
        <div className="flex min-h-0 w-[360px] shrink-0 flex-col border-r">
          <div className="shrink-0 border-b px-4 py-3">
            <h2 className="text-sm font-medium">Nodes</h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Execution progress and results
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {execution.nodes?.length ? (
              <div className="space-y-1">
                {execution.nodes.map((node) => (
                  <ExecutionNodeItem key={node.id} node={node} />
                ))}
              </div>
            ) : (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No node executions found.
              </div>
            )}
          </div>
        </div>

        {/* Execution details / workspace */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="shrink-0 border-b px-4 py-3">
            <h2 className="text-sm font-medium">Execution</h2>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-6">
            <ExecutionOverview execution={execution} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Execution status                                                           */
/* -------------------------------------------------------------------------- */

interface ExecutionStatusProps {
  status: ExecutionStatusType;
}

function ExecutionStatus({ status }: ExecutionStatusProps) {
  const config: Record<
    ExecutionStatusType,
    {
      label: string;
      className: string;
    }
  > = {
    pending: {
      label: "Pending",
      className: "bg-muted text-muted-foreground",
    },

    running: {
      label: "Running",
      className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    },

    success: {
      label: "Success",
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
    },

    error: {
      label: "Error",
      className: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-500",
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${current.className}`}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />

      {current.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Execution stat                                                             */
/* -------------------------------------------------------------------------- */

function ExecutionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-[11px] text-muted-foreground">{label}</div>

      <div className="max-w-[180px] truncate text-xs font-medium">{value}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Execution node                                                             */
/* -------------------------------------------------------------------------- */

function ExecutionNodeItem({
  node,
}: {
  node: {
    id: string;
    nodeId: string;
    nodeType: string;
    nodeTitle: string;
    status: NodeStatusType;
    duration: number | null;
    error: string | null;
  };
}) {
  return (
    <div className="rounded-md border px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{node.nodeTitle}</div>

          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {node.nodeType}
          </div>
        </div>

        <NodeStatus status={node.status} />
      </div>

      {(node.duration != null || node.error) && (
        <div className="mt-2 text-xs text-muted-foreground">
          {node.duration != null && (
            <span>
              {node.duration < 1000
                ? `${node.duration}ms`
                : `${(node.duration / 1000).toFixed(2)}s`}
            </span>
          )}

          {node.error && (
            <p className="mt-1 break-words text-red-500">{node.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Node status                                                                */
/* -------------------------------------------------------------------------- */

function NodeStatus({ status }: { status: NodeStatusType }) {
  const config: Record<NodeStatusType, string> = {
    idle: "text-muted-foreground",
    running: "text-yellow-500",
    success: "text-green-500",
    error: "text-red-500",
    disabled: "text-muted-foreground",
  };

  return (
    <span className={`shrink-0 text-xs font-medium ${config[status]}`}>
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Execution overview                                                         */
/* -------------------------------------------------------------------------- */

function ExecutionOverview({
  execution,
}: {
  execution: {
    input: unknown;
    output: unknown;
    error: string | null;
  };
}) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-medium">Input</h3>

        <JsonValue value={execution.input} />
      </section>

      <section>
        <h3 className="text-sm font-medium">Output</h3>

        <JsonValue value={execution.output} />
      </section>

      {execution.error && (
        <section>
          <h3 className="text-sm font-medium">Error</h3>

          <pre className="mt-2 overflow-auto rounded-md border bg-muted/50 p-3 text-xs text-red-500">
            {execution.error}
          </pre>
        </section>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* JSON value                                                                 */
/* -------------------------------------------------------------------------- */

function JsonValue({ value }: { value: unknown }) {
  if (value == null) {
    return (
      <div className="mt-2 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
        No data
      </div>
    );
  }

  let formatted: string;

  try {
    formatted = JSON.stringify(value, null, 2);
  } catch {
    formatted = String(value);
  }

  return (
    <pre className="mt-2 max-h-[400px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs">
      {formatted}
    </pre>
  );
}
