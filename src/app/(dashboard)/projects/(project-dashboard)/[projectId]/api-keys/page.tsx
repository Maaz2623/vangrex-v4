import { PageHeader } from "@/components/page-header";
import { ApiKeys } from "@/features/api-keys/components/api-keys";
import { prefetch, trpc } from "@/trpc/server";

interface ApiKeysPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const ApiKeysPage = async ({
  params,
}: ApiKeysPageProps) => {
  const { projectId } = await params;

  prefetch(trpc.apiKeys.get.queryOptions({
    projectId: projectId
  }))


  return (
    <div className="space-y-10 px-8 py-8">
      <PageHeader
        title="API Keys"
        description="Create and manage API keys for your Vangrex applications."
      />

      <ApiKeys projectId={projectId} />
    </div>
  );
};

export default ApiKeysPage;