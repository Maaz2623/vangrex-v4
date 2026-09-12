import { useCanvasStore } from "@/features/canvas/store/canvas-store";
import { useExecutionStore } from "@/features/canvas/store/execution-store";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useExecutions(workflowId: string) {
  const trpc = useTRPC();

  return useQuery(
    trpc.executions.list.queryOptions({
      workflowId,
    }),
  );
}

export function useExecution(executionId: string) {
  const trpc = useTRPC();

  return useQuery(
    trpc.executions.get.queryOptions({
      executionId,
    }),
  );
}

export function useExecuteWorkflow(workflowId: string, projectId: string) {
  const { setRunId, setExecutionId, setExecutionStatus } = useCanvasStore();
  const router = useRouter();
  const trpc = useTRPC();

  return useMutation(
    trpc.executions.execute.mutationOptions({
      onSuccess: (data) => {
        const executionUrl = `/projects/${projectId}/workflows/${workflowId}/executions/${data.executionId}`;
        toast.success("Execution started", {
          description:
            "Your workflow is running. You can follow its progress live.",
          action: {
            label: "View execution →",
            onClick: () => {
              router.push(executionUrl);
            },
          },
        });
        setRunId(data.runId);
        setExecutionId(data.executionId);
        setExecutionStatus("running");
      },
    }),
  );
}
