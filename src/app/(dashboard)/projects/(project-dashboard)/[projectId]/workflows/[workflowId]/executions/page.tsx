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
    <div className="h-screen w-full max-h-screen">
      <ExecutionsView projectId={projectId} workflowId={workflowId} />
    </div>
  );
}
