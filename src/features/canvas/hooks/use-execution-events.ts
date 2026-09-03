import { useSubscription } from "@trpc/tanstack-react-query";
import { useEffect } from "react";
import { useExecutionStore } from "../store/execution-store";
import { useTRPC } from "@/trpc/client";
import { useRealtime } from "inngest/react";
import { workflowChannel } from "@/lib/inngest/channels";
import { getWorkflowRealtimeToken } from "@/lib/inngest/realtime-token";
import { NodeStatusType } from "../components/nodes/types";
import { ExecutionOutput } from "../services/execution/execution-output";

export function useExecutionEvents(executionId: string | null) {
  console.log("[realtime] executionId:", executionId);

  const realtime = useRealtime({
    channel: workflowChannel({ executionId: executionId ?? "" }),
    topics: ["nodeStatus", "nodeOutput"] as const,
    token: () => getWorkflowRealtimeToken(executionId!),
    enabled: !!executionId,
  });

  useEffect(() => {
    console.log("[realtime] connection:", {
      executionId,
      connectionStatus: realtime.connectionStatus,
      runStatus: realtime.runStatus,
    });
  }, [executionId, realtime.connectionStatus, realtime.runStatus]);

  const setNodeStatus = useExecutionStore((state) => state.setNodeStatus);

  const addEvent = useExecutionStore((state) => state.addEvent);

  useEffect(() => {
    for (const message of realtime.messages.delta) {
      if (message.topic === "nodeStatus") {
        const { nodeId, status } = message.data as {
          executionId: string;
          nodeId: string;
          status: NodeStatusType;
        };

        console.log("[realtime] node status:", {
          nodeId,
          status,
        });

        setNodeStatus(nodeId, status);
      }

      if (message.topic === "nodeOutput") {
        const { nodeId, output } = message.data as {
          executionId: string;
          nodeId: string;
          output: ExecutionOutput;
        };

        console.log("[realtime] node output:", {
          nodeId,
          output,
        });

        useExecutionStore.getState().setOutput(nodeId, output);
      }
    }
  }, [realtime.messages.delta, setNodeStatus]);
}
