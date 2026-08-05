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
    <header className="w-[95%] bg-transparent rounded-xl">
      <div className="flex flex-col gap-5 px-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}

        <div />

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">
          <Button>
            <Play className="mr-1 h-4 w-4" />
            Run
          </Button>

          <Button variant="outline">
            <Save className="mr-1 h-4 w-4" />
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
