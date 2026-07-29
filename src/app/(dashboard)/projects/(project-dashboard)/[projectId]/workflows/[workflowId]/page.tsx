import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    projectId: string;
    workflowId: string;
  }>;
}

const WorkflowIdPage = async ({ params }: Props) => {
  const { projectId, workflowId } = await params;

  return redirect(`/projects/${projectId}/workflows/${workflowId}/overview`);
};

export default WorkflowIdPage;
