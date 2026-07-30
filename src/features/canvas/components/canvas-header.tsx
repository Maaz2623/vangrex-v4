"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetWorkflow } from "@/features/workflows/hooks/use-workflows";
import { MoreHorizontal, PenLine, Play, Save, Upload } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Props = {
  projectId: string;
  workflowId: string;
};

export const CanvasHeader = ({ projectId, workflowId }: Props) => {
  const { data: workflow, isLoading } = useGetWorkflow({
    projectId,
    workflowId,
  });

  if (isLoading || !workflow) {
    return <CanvasHeaderSkeleton />;
  }

  return (
    <header className="border-b bg-background">
      <div className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-2xl font-semibold">
              {workflow.name ?? "Untitled Workflow"}
            </h1>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <PenLine className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>
              Last updated{" "}
              {formatDistanceToNow(workflow.updatedAt, {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>

          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          {/* 
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Publish
          </Button> */}

          <Button size="icon" variant="outline">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export const CanvasHeaderSkeleton = () => {
  return (
    <header className="border-b bg-background">
      <div className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="min-w-0 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="hidden h-4 w-px sm:block" />
            <Skeleton className="hidden h-6 w-14 rounded-full sm:block" />
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </header>
  );
};
