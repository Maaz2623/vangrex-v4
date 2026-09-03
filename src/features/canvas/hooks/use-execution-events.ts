"use client";

import { useEffect } from "react";
import { useRealtimeRun, useRealtimeStream } from "@trigger.dev/react-hooks";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { nodeOutputStream, nodeStatusStream } from "@/trigger/streams";

import { useExecutionStore } from "../store/execution-store";
import { useCanvasStore } from "../store/canvas-store";

export function useExecutionEvents(runId: string | null) {
  const trpc = useTRPC();

  const setNodeStatus = useExecutionStore((state) => state.setNodeStatus);

  const setOutput = useExecutionStore((state) => state.setOutput);

  const setExecutionStatus = useCanvasStore(
    (state) => state.setExecutionStatus,
  );

  const realtimeToken = useQuery(
    trpc.executions.realtimeToken.queryOptions({
      runId: runId ?? "",
    }),
  );

  const accessToken = realtimeToken.data?.token;

  const { run, error: runError } = useRealtimeRun(runId ?? "", {
    accessToken,
    enabled: !!runId && !!accessToken,
  });

  const { parts: statusParts, error: statusError } = useRealtimeStream(
    nodeStatusStream,
    runId ?? "",
    {
      accessToken,
      enabled: !!runId && !!accessToken,
    },
  );

  const { parts: outputParts, error: outputError } = useRealtimeStream(
    nodeOutputStream,
    runId ?? "",
    {
      accessToken,
      enabled: !!runId && !!accessToken,
    },
  );

  /*
   * Node status events
   */
  useEffect(() => {
    if (!statusParts) return;

    for (const event of statusParts) {
      setNodeStatus(event.nodeId, event.status);
    }
  }, [statusParts, setNodeStatus]);

  /*
   * Node output events
   */
  useEffect(() => {
    if (!outputParts) return;

    for (const event of outputParts) {
      setOutput(event.nodeId, event.output);
    }
  }, [outputParts, setOutput]);

  /*
   * Workflow-level status
   *
   * Trigger is the source of truth here.
   * Do NOT derive workflow completion from node states.
   */
  useEffect(() => {
    if (!run) return;

    const status = String(run.status).toUpperCase();

    console.log("[trigger] workflow status:", status);

    switch (status) {
      case "PENDING":
      case "QUEUED":
        setExecutionStatus("starting");
        break;

      case "EXECUTING":
      case "RUNNING":
        setExecutionStatus("running");
        break;

      case "COMPLETED":
        setExecutionStatus("success");
        break;

      case "FAILED":
      case "CANCELED":
      case "CANCELLED":
        setExecutionStatus("error");
        break;
    }
  }, [run, setExecutionStatus]);

  useEffect(() => {
    if (realtimeToken.error) {
      console.error("[trigger] realtime token error:", realtimeToken.error);
    }

    if (runError) {
      console.error("[trigger] run realtime error:", runError);
    }

    if (statusError) {
      console.error("[trigger] node status stream error:", statusError);
    }

    if (outputError) {
      console.error("[trigger] node output stream error:", outputError);
    }
  }, [realtimeToken.error, runError, statusError, outputError]);

  return {
    run,
    statusParts,
    outputParts,
    error:
      realtimeToken.error ?? runError ?? statusError ?? outputError ?? null,
  };
}
