import { PageHeader } from "@/components/page-header";
import {
  CreateWorkflow,
  SearchWorkflow,
  Workflows,
} from "@/features/workflows/components/workflows";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

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

  return (
    <div className="space-y-10 px-8 py-8">
      <HydrateClient>
        <PageHeader
          title="Workflows"
          description="Create and manage your workflows"
          action={<CreateWorkflow projectId={projectId} />}
        />
        <SearchWorkflow />
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <Workflows projectId={projectId} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
};

export default WorkflowsPage;
