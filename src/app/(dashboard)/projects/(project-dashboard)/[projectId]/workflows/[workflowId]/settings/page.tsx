import WorkflowSettings from "@/features/workflows/components/workflow-settings";
import { getQueryClient, HydrateClient, prefetch, trpc } from "@/trpc/server";
import React from "react";

interface Props {
  params: Promise<{
    projectId: string;
    workflowId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { workflowId, projectId } = await params;

  const queryClient = getQueryClient();

  prefetch(
    trpc.workflows.getWorkflow.queryOptions({
      workflowId,
      projectId: projectId,
    }),
  );

  return (
    <HydrateClient>
      <WorkflowSettings projectId={projectId} workflowId={workflowId} />;
    </HydrateClient>
  );
};

export default Page;
