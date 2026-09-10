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
      <div className="flex h-full w-full items-center justify-center p-6">
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
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 border-b bg-background">
        <div className="flex min-w-0 items-center justify-between gap-6 px-6 py-4">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-3">
              <h1 className="truncate text-base font-semibold">
                Execution
              </h1>

              <ExecutionStatus status={execution.status} />
            </div>

            <div className="mt-1 flex min-w-0 items-center gap-2">
              <span className="truncate font-mono text-[11px] text-muted-foreground">
                {execution.id}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center divide-x rounded-md border bg-muted/20">
            <ExecutionStat
              label="Nodes"
              value={String(execution.nodes?.length ?? 0)}
            />

            <ExecutionStat
              label="Duration"
              value={duration ?? "—"}
            />

            <ExecutionStat
              label="Started"
              value={
                execution.startedAt
                  ? formatDate(execution.startedAt)
                  : "—"
              }
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* Node list */}
        <aside className="flex min-h-0 w-[320px] shrink-0 flex-col border-r bg-muted/[0.12]">
          <div className="shrink-0 border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Nodes</h2>

              <span className="text-[11px] text-muted-foreground">
                {execution.nodes?.length ?? 0}
              </span>
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Execution steps and results
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {execution.nodes?.length ? (
              <div className="space-y-1">
                {execution.nodes.map((node) => (
                  <ExecutionNodeItem
                    key={node.id}
                    node={node}
                  />
                ))}
              </div>
            ) : (
              <div className="px-3 py-10 text-center text-xs text-muted-foreground">
                No node executions found.
              </div>
            )}
          </div>
        </aside>

        {/* Detail */}
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <div className="shrink-0 border-b px-6 py-3">
              <h2 className="text-sm font-medium">Execution details</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Input, output, and execution errors
              </p>
            </div>

            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mx-auto w-full max-w-5xl min-w-0 p-6">
                <ExecutionOverview execution={execution} />
              </div>
            </div>
          </div>
        </main>
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
      className:
        "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    },
    success: {
      label: "Success",
      className:
        "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    error: {
      label: "Error",
      className:
        "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    cancelled: {
      label: "Cancelled",
      className:
        "bg-red-500/10 text-red-600 dark:text-red-400",
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${current.className}`}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {current.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Execution stat                                                             */
/* -------------------------------------------------------------------------- */

function ExecutionStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="px-4 py-2 text-right">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>

      <div className="mt-0.5 max-w-[180px] truncate text-xs font-medium">
        {value}
      </div>
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
  const statusConfig: Record<
    NodeStatusType,
    {
      label: string;
      dot: string;
      text: string;
    }
  > = {
    idle: {
      label: "Idle",
      dot: "bg-muted-foreground/40",
      text: "text-muted-foreground",
    },
    running: {
      label: "Running",
      dot: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
    },
    success: {
      label: "Success",
      dot: "bg-green-500",
      text: "text-green-600 dark:text-green-400",
    },
    error: {
      label: "Error",
      dot: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
    },
    disabled: {
      label: "Disabled",
      dot: "bg-muted-foreground/40",
      text: "text-muted-foreground",
    },
  };

  const current = statusConfig[node.status];

  return (
    <div className="group min-w-0 rounded-md border bg-background px-3 py-2.5 transition-colors hover:bg-muted/30">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`mt-1.5 size-2 shrink-0 rounded-full ${current.dot}`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <div className="min-w-0 truncate text-sm font-medium">
              {node.nodeTitle}
            </div>

            <span
              className={`shrink-0 text-[10px] font-medium ${current.text}`}
            >
              {current.label}
            </span>
          </div>

          <div className="mt-0.5 flex min-w-0 items-center justify-between gap-3">
            <span className="truncate text-[11px] text-muted-foreground">
              {node.nodeType}
            </span>

            {node.duration != null && (
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                {formatDuration(node.duration)}
              </span>
            )}
          </div>

          {node.error && (
            <div className="mt-2 overflow-hidden rounded border border-red-500/20 bg-red-500/5 px-2 py-1.5">
              <p className="break-words text-[11px] leading-relaxed text-red-500">
                {node.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
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
    <div className="min-w-0 space-y-4">
      <DataSection
        title="Input"
        description="Data provided when the execution started."
      >
        <JsonValue value={execution.input} />
      </DataSection>

      <DataSection
        title="Output"
        description="Final data produced by the workflow."
      >
        <JsonValue value={execution.output} />
      </DataSection>

      {execution.error && (
        <DataSection
          title="Error"
          description="The execution ended with an error."
        >
          <div className="min-w-0 overflow-hidden rounded-md border border-red-500/20 bg-red-500/5">
            <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed text-red-500">
              {execution.error}
            </pre>
          </div>
        </DataSection>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Data section                                                               */
/* -------------------------------------------------------------------------- */

function DataSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-background">
      <div className="border-b bg-muted/20 px-4 py-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="min-w-0 p-4">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* JSON value                                                                 */
/* -------------------------------------------------------------------------- */

function JsonValue({ value }: { value: unknown }) {
  if (value == null) {
    return (
      <div className="rounded-md border border-dashed bg-muted/20 px-4 py-6 text-center text-xs text-muted-foreground">
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
    <div className="min-w-0 max-w-full overflow-hidden rounded-md border bg-muted/20">
      <pre className="max-h-[500px] max-w-full overflow-x-auto overflow-y-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed">
        {formatted}
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

function formatDuration(duration: number) {
  if (duration < 1000) {
    return `${duration}ms`;
  }

  return `${(duration / 1000).toFixed(2)}s`;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
