import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: Props) => {
  await requireAuth();

  const { projectId } = await params;

  redirect(`/projects/${projectId}/workflows`);
};

export default ProjectPage;
