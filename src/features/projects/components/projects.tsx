import { PageHeader } from "@/components/page-header";
import { CreateProject } from "./create-project";
import { ProjectsList } from "./projects-list";
import { ProjectSearch } from "./project-search";

export const Projects = () => {
  return (
    <div className="w-full flex flex-col space-y-10 px-10 py-10">
      <PageHeader
        title="Projects"
        description="Create and manage your projects"
        action={<CreateProject />}
      />
      <ProjectSearch />
      <ProjectsList />
    </div>
  );
};
