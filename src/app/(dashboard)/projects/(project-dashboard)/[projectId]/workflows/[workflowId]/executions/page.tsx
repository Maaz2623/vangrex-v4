import { ExecutionsView } from "@/features/executions/components/execution-overview";

interface ExecutionsPageProps {
  params: Promise<{
    projectId: string;
    workflowId: string;
  }>;
}

export default async function ExecutionsPage({ params }: ExecutionsPageProps) {
  const { projectId, workflowId } = await params;

  return (
    <div className="h-full w-full">
      <ExecutionsView projectId={projectId} workflowId={workflowId} />
    </div>
  );
}
