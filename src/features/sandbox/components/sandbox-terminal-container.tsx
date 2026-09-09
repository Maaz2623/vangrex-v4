"use client";

import { useEffect, useState } from "react";

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

  const realtimeToken = useQuery(
    trpc.executions.realtimeToken.queryOptions({
      runId: runId ?? "",
    }),
  );

  const startTerminal = useMutation(
    trpc.sandbox.startTerminal.mutationOptions({
      onSuccess: (result) => {
        setRunId(result.runId);
      },
    }),
  );

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

  if (startTerminal.isPending) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0F172A] text-xs text-muted-foreground">
        Starting terminal...
      </div>
    );
  }

  if (startTerminal.error) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0F172A] px-4 text-xs text-destructive">
        Failed to start terminal: {startTerminal.error.message}
      </div>
    );
  }

  if (!runId) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0F172A] text-xs text-muted-foreground">
        Initializing terminal...
      </div>
    );
  }

  if (realtimeToken.isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0F172A] text-xs text-muted-foreground">
        Connecting terminal...
      </div>
    );
  }

  if (realtimeToken.error) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0F172A] px-4 text-xs text-destructive">
        Failed to authenticate terminal: {realtimeToken.error.message}
      </div>
    );
  }

  const accessToken = realtimeToken.data?.token;

  if (!accessToken) {
    return (
      <div className="flex h-full items-center justify-center bg-[#0F172A] text-xs text-muted-foreground">
        Waiting for terminal connection...
      </div>
    );
  }

  return (
    <SandboxTerminal
      sandboxId={sandboxId}
      runId={runId}
      accessToken={accessToken}
    />
  );
}
