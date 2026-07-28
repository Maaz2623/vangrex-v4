import { Workflows } from "@/features/workflows/components/workflows";
import { requireAuth } from "@/lib/auth-utils";
import { prefetch, trpc } from "@/trpc/server";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

const WorkflowsPage = async ({ params }: Props) => {
  await requireAuth();

  const { projectId } = await params;

  prefetch(
    trpc.workflows.getWorkflows.queryOptions({
      projectId: projectId,
    }),
  );

  return <Workflows projectId={projectId} />;
};

export default WorkflowsPage;
