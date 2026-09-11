"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetWorkflow } from "@/features/workflows/hooks/use-workflows";
import { AlertCircle, Check, Loader2, Play, PlayIcon } from "lucide-react";
import { useCanvasStore } from "../store/canvas-store";
import { useExecutionStore } from "../store/execution-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useExecutionEvents } from "../hooks/use-execution-events";
import { AppFlowNode } from "./nodes/node-config";
import { FlowEdge } from "./edges/types/base-edge";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

type Props = {
  projectId: string;
  workflowId: string;
  nodes: AppFlowNode[];
  edges: FlowEdge[];
};

export const CanvasHeader = ({
  nodes,
  edges,
  projectId,
  workflowId,
}: Props) => {
  const trpc = useTRPC();

  const executeWorkflowMutation = useMutation(
    trpc.executions.execute.mutationOptions(),
  );

  const { setExecutionStatus, setRunId, setExecutionId } = useCanvasStore();

  const { setExecuteWorkflow, executionStatus, executionId } = useCanvasStore();

  console.log("Execution Id", executionId);

  const { data: workflow, isLoading } = useGetWorkflow({
    projectId,
    workflowId,
  });

  const nodeStates = useExecutionStore((state) => state.nodeStates);

  const router = useRouter();
  if (isLoading || !workflow) {
    return <CanvasHeaderSkeleton />;
  }

  const statuses = Object.values(nodeStates);

  const handleRun = () => {
    setExecutionStatus("starting");

    executeWorkflowMutation.mutate(
      {
        workflowId,
        nodes,
        edges,
      },
      {
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

        onError: (error) => {
          console.error("🔥 WORKFLOW MUTATION ERROR:", error);
          setExecutionStatus("error");
        },
      },
    );

    setExecuteWorkflow(false);
  };

  return (
    <header className="w-[95%] rounded-xl bg-transparent">
      <div className="flex flex-col gap-5 px-4 lg:flex-row lg:items-center lg:justify-between">
        <div />

        <div className="flex items-center gap-3">
          <Button onClick={handleRun} disabled={false} className="">
            <PlayIcon />
            Trigger
          </Button>
        </div>
      </div>
    </header>
  );
};

export const CanvasHeaderSkeleton = () => {
  return (
    <header className="w-[95%] bg-transparent">
      <div className="flex flex-col gap-5 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          <div className="mt-2">
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </header>
  );
};
