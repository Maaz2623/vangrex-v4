import { requireAuth } from "@/lib/auth-utils";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: Props) => {
  await requireAuth();

  const { projectId } = await params;
  return <div className="w-full">Workflows</div>;
};

export default ProjectPage;
