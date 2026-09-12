"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  GitBranch,
  Play,
  Settings2,
  Sparkles,
  Timer,
  XCircle,
  Zap,
} from "lucide-react";

import { useExecutions } from "@/features/executions/hooks/use-executions";
import { useGetWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useGetNodes } from "@/features/canvas/hooks/node.hooks";
import { useGetEdges } from "@/features/canvas/hooks/edge.hooks";

const OverviewPage = () => {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId as string;
  const workflowId = params.workflowId as string;

  const workflowQuery = useGetWorkflow({
    projectId,
    workflowId,
  });

  const nodesQuery = useGetNodes(workflowId);
  const edgesQuery = useGetEdges(workflowId);
  const executionsQuery = useExecutions(workflowId);

  const workflow = workflowQuery.data;
  const nodes = nodesQuery.data ?? [];
  const edges = edgesQuery.data ?? [];
  const executions = executionsQuery.data ?? [];

  const isLoading =
    workflowQuery.isLoading ||
    nodesQuery.isLoading ||
    edgesQuery.isLoading ||
    executionsQuery.isLoading;

  const latestExecution = executions[0];

  const metrics = useMemo(() => {
    const total = executions.length;

    const successful = executions.filter(
      (execution) => execution.status === "success",
    ).length;

    const failed = executions.filter(
      (execution) => execution.status === "error",
    ).length;

    const running = executions.filter(
      (execution) => execution.status === "running",
    ).length;

    const completedExecutions = executions.filter(
      (execution) => execution.startedAt && execution.completedAt,
    );

    const durations = completedExecutions
      .map((execution) => {
        const started = new Date(execution.startedAt!).getTime();

        const completed = new Date(execution.completedAt!).getTime();

        const duration = completed - started;

        return duration > 0 ? duration : null;
      })
      .filter((duration): duration is number => duration !== null);

    const averageDuration =
      durations.length > 0
        ? durations.reduce((sum, duration) => sum + duration, 0) /
          durations.length
        : null;

    const successRate =
      total > 0 ? Math.round((successful / total) * 1000) / 10 : 0;

    return {
      total,
      successful,
      failed,
      running,
      successRate,
      averageDuration,
    };
  }, [executions]);

  const workflowState = useMemo(() => {
    if (metrics.running > 0) {
      return {
        label: "Running",
        className:
          "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
        dotClassName: "bg-blue-500",
      };
    }

    if (!latestExecution) {
      return {
        label: "Ready",
        className: "border-muted bg-muted/50 text-muted-foreground",
        dotClassName: "bg-muted-foreground",
      };
    }

    if (latestExecution.status === "error") {
      return {
        label: "Needs attention",
        className: "border-destructive/20 bg-destructive/10 text-destructive",
        dotClassName: "bg-destructive",
      };
    }

    if (latestExecution.status === "success") {
      return {
        label: "Healthy",
        className:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        dotClassName: "bg-emerald-500",
      };
    }

    return {
      label: "Ready",
      className: "border-muted bg-muted/50 text-muted-foreground",
      dotClassName: "bg-muted-foreground",
    };
  }, [latestExecution, metrics.running]);

  const activity = useMemo(() => {
    const now = new Date();

    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(now);

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (29 - index));

      return {
        date,
        total: 0,
        successful: 0,
        failed: 0,
      };
    });

    executions.forEach((execution) => {
      const createdAt = new Date(execution.createdAt);

      const day = days.find(
        (item) =>
          item.date.getFullYear() === createdAt.getFullYear() &&
          item.date.getMonth() === createdAt.getMonth() &&
          item.date.getDate() === createdAt.getDate(),
      );

      if (!day) return;

      day.total += 1;

      if (execution.status === "success") {
        day.successful += 1;
      }

      if (execution.status === "error") {
        day.failed += 1;
      }
    });

    return days;
  }, [executions]);

  const maxActivity = Math.max(...activity.map((day) => day.total), 1);

  const formatDuration = (milliseconds: number | null) => {
    if (milliseconds === null) {
      return "—";
    }

    if (milliseconds < 1000) {
      return `${Math.round(milliseconds)}ms`;
    }

    if (milliseconds < 60_000) {
      return `${(milliseconds / 1000).toFixed(1)}s`;
    }

    return `${(milliseconds / 60_000).toFixed(1)}m`;
  };

  const formatRelativeTime = (date: Date | string | null | undefined) => {
    if (!date) {
      return "—";
    }

    const timestamp = new Date(date).getTime();
    const difference = Date.now() - timestamp;

    const seconds = Math.floor(difference / 1000);

    const minutes = Math.floor(seconds / 60);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    if (seconds < 10) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;

    return new Date(date).toLocaleDateString();
  };

  const getExecutionDuration = (execution: (typeof executions)[number]) => {
    if (!execution.startedAt) {
      return null;
    }

    if (execution.completedAt) {
      return (
        new Date(execution.completedAt).getTime() -
        new Date(execution.startedAt).getTime()
      );
    }

    return Date.now() - new Date(execution.startedAt).getTime();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-16 w-2/3 rounded-xl bg-muted" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 rounded-xl bg-muted" />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="h-80 rounded-xl bg-muted lg:col-span-2" />
              <div className="h-80 rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-card shadow-sm">
              <Zap className="h-5 w-5 text-primary" />
            </div>

            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {workflow?.name ?? "Workflow"}
                </h1>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${workflowState.className}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${workflowState.dotClassName}`}
                  />

                  {workflowState.label}
                </span>
              </div>

              <p className="max-w-2xl text-sm text-muted-foreground">
                {workflow?.description ||
                  "Monitor executions, workflow performance, and runtime activity."}
              </p>

              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-mono">{workflowId}</span>

                <button
                  onClick={() => navigator.clipboard.writeText(workflowId)}
                  className="transition-colors hover:text-foreground"
                  title="Copy workflow ID"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>

                <span className="h-3 w-px bg-border" />

                <span>
                  Updated{" "}
                  {workflow?.updatedAt
                    ? formatRelativeTime(workflow.updatedAt)
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() =>
                router.push(
                  `/projects/${projectId}/workflows/${workflowId}/settings`,
                )
              }
              className="inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </button>

            <button
              onClick={() =>
                router.push(`/projects/${projectId}/workflows/${workflowId}`)
              }
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <Play className="h-4 w-4" />
              Open workflow
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Activity className="h-4 w-4" />}
            label="Total executions"
            value={metrics.total.toLocaleString()}
            footer="All time"
          />

          <StatCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Success rate"
            value={`${metrics.successRate}%`}
            footer={`${metrics.successful.toLocaleString()} successful`}
          />

          <StatCard
            icon={<Timer className="h-4 w-4" />}
            label="Avg. execution"
            value={formatDuration(metrics.averageDuration)}
            footer={
              executions.length > 0
                ? `${executions.length.toLocaleString()} measured runs`
                : "No completed runs"
            }
          />

          <StatCard
            icon={<XCircle className="h-4 w-4" />}
            label="Failed executions"
            value={metrics.failed.toLocaleString()}
            footer={
              metrics.running > 0
                ? `${metrics.running} currently running`
                : "All executions completed"
            }
          />
        </div>

        {/* Main */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Activity */}
          <div className="rounded-xl border bg-card shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="font-semibold">Execution activity</h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Executions over the last 30 days
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Executions
                </div>

                {metrics.failed > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    Failed
                  </div>
                )}
              </div>
            </div>

            <div className="p-5">
              {metrics.total === 0 ? (
                <EmptyActivity />
              ) : (
                <>
                  <div className="relative h-56">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 1, 2, 3].map((line) => (
                        <div
                          key={line}
                          className="w-full border-t border-dashed border-border/70"
                        />
                      ))}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 top-0 flex items-end gap-1 px-1">
                      {activity.map((day) => {
                        const height =
                          day.total === 0
                            ? 2
                            : Math.max((day.total / maxActivity) * 100, 4);

                        return (
                          <div
                            key={day.date.toISOString()}
                            className="group relative flex h-full flex-1 items-end"
                            title={`${day.total} execution${
                              day.total === 1 ? "" : "s"
                            } · ${day.date.toLocaleDateString()}`}
                          >
                            <div
                              className="w-full rounded-sm bg-primary/20 transition-colors group-hover:bg-primary/40"
                              style={{
                                height: `${height}%`,
                              }}
                            />

                            {day.failed > 0 && (
                              <div
                                className="absolute bottom-0 w-full rounded-sm bg-destructive/60"
                                style={{
                                  height: `${Math.max(
                                    (day.failed / maxActivity) * 100,
                                    3,
                                  )}%`,
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {activity[0]?.date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    <span>
                      {activity[14]?.date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    <span>
                      {activity[29]?.date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Workflow details */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold">Workflow details</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Configuration and runtime information
              </p>
            </div>

            <div className="divide-y">
              <InfoRow
                icon={<GitBranch className="h-4 w-4" />}
                label="Nodes"
                value={nodes.length.toString()}
              />

              <InfoRow
                icon={<GitBranch className="h-4 w-4" />}
                label="Connections"
                value={edges.length.toString()}
              />

              <InfoRow
                icon={<Activity className="h-4 w-4" />}
                label="Executions"
                value={executions.length.toString()}
              />

              <InfoRow
                icon={<Clock3 className="h-4 w-4" />}
                label="Last run"
                value={formatRelativeTime(latestExecution?.createdAt)}
              />

              <InfoRow
                icon={<Timer className="h-4 w-4" />}
                label="Last duration"
                value={formatDuration(
                  latestExecution
                    ? getExecutionDuration(latestExecution)
                    : null,
                )}
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent executions */}
          <div className="rounded-xl border bg-card shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="font-semibold">Recent executions</h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  The latest workflow runs
                </p>
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/projects/${projectId}/workflows/${workflowId}/executions`,
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                View all
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            {executions.length === 0 ? (
              <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Play className="h-4 w-4 text-muted-foreground" />
                </div>

                <p className="text-sm font-medium">No executions yet</p>

                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  Run this workflow to see execution history and runtime
                  statistics here.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {executions.slice(0, 5).map((execution) => {
                  const duration = getExecutionDuration(execution);

                  return (
                    <button
                      key={execution.id}
                      onClick={() =>
                        router.push(
                          `/projects/${projectId}/workflows/${workflowId}/executions/${execution.id}`,
                        )
                      }
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <ExecutionStatusIcon status={execution.status} />

                        <div className="min-w-0">
                          <p className="truncate font-mono text-sm font-medium">
                            {execution.id}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatRelativeTime(execution.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="ml-4 flex shrink-0 items-center gap-6">
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(duration)}
                        </span>

                        <ExecutionStatus status={execution.status} />

                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold">Quick actions</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Common workflow operations
              </p>
            </div>

            <div className="space-y-2 p-4">
              <QuickAction
                icon={<Play className="h-4 w-4" />}
                title="Run workflow"
                description="Start a new execution"
                onClick={() =>
                  router.push(`/projects/${projectId}/workflows/${workflowId}`)
                }
              />

              <QuickAction
                icon={<GitBranch className="h-4 w-4" />}
                title="Edit workflow"
                description={`${nodes.length} nodes · ${edges.length} connections`}
                onClick={() =>
                  router.push(`/projects/${projectId}/workflows/${workflowId}`)
                }
              />

              <QuickAction
                icon={<ExternalLink className="h-4 w-4" />}
                title="View executions"
                description={`${executions.length} total executions`}
                onClick={() =>
                  router.push(
                    `/projects/${projectId}/workflows/${workflowId}/executions`,
                  )
                }
              />

              <QuickAction
                icon={<Sparkles className="h-4 w-4" />}
                title="Test workflow"
                description="Run a test input"
                onClick={() =>
                  router.push(`/projects/${projectId}/workflows/${workflowId}`)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  footer,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  footer: string;
}) => {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>

        <p className="mt-1 text-xs text-muted-foreground">{label}</p>

        <p className="mt-2 text-[11px] text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>

      <span className="text-sm font-medium">{value}</span>
    </div>
  );
};

const ExecutionStatusIcon = ({ status }: { status: string }) => {
  if (status === "success") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Clock3 className="h-4 w-4" />
    </div>
  );
};

const ExecutionStatus = ({ status }: { status: string }) => {
  const config: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    success: {
      label: "Success",
      className: "text-emerald-600 dark:text-emerald-400",
    },

    error: {
      label: "Failed",
      className: "text-destructive",
    },

    running: {
      label: "Running",
      className: "text-blue-600 dark:text-blue-400",
    },

    pending: {
      label: "Pending",
      className: "text-muted-foreground",
    },

    cancelled: {
      label: "Cancelled",
      className: "text-muted-foreground",
    },
  };

  const current = config[status] ?? {
    label: status,
    className: "text-muted-foreground",
  };

  return (
    <span className={`text-xs font-medium ${current.className}`}>
      {current.label}
    </span>
  );
};

const QuickAction = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all hover:bg-muted/50 hover:shadow-sm"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>

      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
};

const EmptyActivity = () => {
  return (
    <div className="flex h-56 flex-col items-center justify-center text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Activity className="h-4 w-4 text-muted-foreground" />
      </div>

      <p className="text-sm font-medium">No execution activity</p>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Once this workflow runs, execution activity will appear here.
      </p>
    </div>
  );
};

export default OverviewPage;
