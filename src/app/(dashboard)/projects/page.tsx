import { Projects } from "@/features/projects/components/projects";
import { requireAuth } from "@/lib/auth-utils";

const ProjectsPage = async () => {
  await requireAuth();

  return <Projects />;
};

export default ProjectsPage;
