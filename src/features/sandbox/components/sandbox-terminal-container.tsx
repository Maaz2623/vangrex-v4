"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Terminal as TerminalIcon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { SandboxTerminal } from "./sandbox-terminal";

interface SandboxTerminalContainerProps {
  sandboxId: string;
}

export function SandboxTerminalContainer({
  sandboxId,
}: SandboxTerminalContainerProps) {
  const trpc = useTRPC();

  const [runId, setRunId] = useState<string | null>(null);

  const [collapsed, setCollapsed] = useState(false);

  /*
   * Realtime token
   */
  const realtimeToken = useQuery(
    trpc.executions.realtimeToken.queryOptions({
      runId: runId ?? "",
    }),
  );

  /*
   * Start terminal
   */
  const startTerminal = useMutation(
    trpc.sandbox.startTerminal.mutationOptions({
      onSuccess: (result) => {
        setRunId(result.runId);
      },
    }),
  );

  /*
   * Automatically start terminal.
   */
  useEffect(() => {
    if (!sandboxId) return;
    if (runId) return;
    if (startTerminal.isPending) return;

    startTerminal.mutate({
      sandboxId,
      cols: 120,
      rows: 30,
    });
  }, [sandboxId, runId, startTerminal]);

  /*
   * Loading state
   */
  if (startTerminal.isPending) {
    return (
      <div className="h-9 w-full shrink-0 border-t border-border/60 bg-[#0B0F14]">
        <div className="flex h-full items-center px-3">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-yellow-500" />

            <span className="text-[11px] text-muted-foreground">
              Starting terminal...
            </span>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error state
   */
  if (startTerminal.error) {
    return (
      <div className="h-9 w-full shrink-0 border-t border-border/60 bg-[#0B0F14]">
        <div className="flex h-full items-center px-3">
          <span className="truncate text-[11px] text-destructive">
            Failed to start terminal: {startTerminal.error.message}
          </span>
        </div>
      </div>
    );
  }

  /*
   * No run yet
   */
  if (!runId) {
    return (
      <div className="h-9 w-full shrink-0 border-t border-border/60 bg-[#0B0F14]">
        <div className="flex h-full items-center px-3">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-yellow-500" />

            <span className="text-[11px] text-muted-foreground">
              Initializing terminal...
            </span>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Realtime token loading
   */
  if (realtimeToken.isLoading) {
    return (
      <div className="h-9 w-full shrink-0 border-t border-border/60 bg-[#0B0F14]">
        <div className="flex h-full items-center px-3">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-yellow-500" />

            <span className="text-[11px] text-muted-foreground">
              Connecting terminal...
            </span>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Realtime token error
   */
  if (realtimeToken.error) {
    return (
      <div className="h-9 w-full shrink-0 border-t border-border/60 bg-[#0B0F14]">
        <div className="flex h-full items-center px-3">
          <span className="truncate text-[11px] text-destructive">
            Failed to authenticate terminal: {realtimeToken.error.message}
          </span>
        </div>
      </div>
    );
  }

  const accessToken = realtimeToken.data?.token;

  /*
   * Waiting for token
   */
  if (!accessToken) {
    return (
      <div className="h-9 w-full shrink-0 border-t border-border/60 bg-[#0B0F14]">
        <div className="flex h-full items-center px-3">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-yellow-500" />

            <span className="text-[11px] text-muted-foreground">
              Waiting for terminal connection...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "w-full min-w-0 shrink-0 overflow-hidden",
        "border-t border-border/60",
        "bg-[#0B0F14]",
        "transition-[height] duration-200 ease-out",
        collapsed ? "h-9" : "h-[280px]",
      ].join(" ")}
    >
      <div className="flex h-full min-h-0 min-w-0 flex-col">
        {/* Terminal header */}
        <div className="flex h-9 min-w-0 shrink-0 items-center justify-between border-b border-border/40 bg-background/60 px-2.5">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-2">
            <TerminalIcon className="size-3.5 text-muted-foreground/70" />

            <span className="text-[11px] font-medium tracking-tight text-foreground/80">
              Terminal
            </span>

            <span className="text-[10px] text-muted-foreground/40">
              Sandbox
            </span>
          </div>

          {/* Right */}
          <div className="flex shrink-0 items-center gap-1">
            {!collapsed && (
              <span className="mr-1 flex items-center gap-1.5 text-[10px] text-emerald-500/80">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
            )}

            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              title={collapsed ? "Expand terminal" : "Collapse terminal"}
              className="inline-flex size-7 items-center justify-center rounded-[6px] text-muted-foreground/60 transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              {collapsed ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Terminal */}
        {!collapsed && (
          <div className="min-h-0 min-w-0 w-full flex-1 overflow-hidden">
            <SandboxTerminal
              sandboxId={sandboxId}
              runId={runId}
              accessToken={accessToken}
            />
          </div>
        )}
      </div>
    </div>
  );
}
