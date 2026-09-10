import { ExecutionView } from "@/features/executions/components/execution-view";

interface ExecutionPageProps {
  params: Promise<{
    projectId: string;
    workflowId: string;
    executionId: string;
  }>;
}

export default async function ExecutionPage({ params }: ExecutionPageProps) {
  const { projectId, workflowId, executionId } = await params;

  return (
    <div className="h-full w-full">
      <ExecutionView
        projectId={projectId}
        workflowId={workflowId}
        executionId={executionId}
      />
    </div>
  );
}
