import { PageHeader } from "@/components/page-header";
import { CreateProject } from "./create-project";
import { ProjectsList } from "./projects-list";
import { ProjectSearch } from "./project-search";
import { getQueryClient, HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const Projects = async () => {
  prefetch(trpc.projects.getProjects.queryOptions());

  return (
    <div className="w-full flex flex-col space-y-10 px-10 py-10">
      <HydrateClient>
        <PageHeader
          title="Projects"
          description="Create and manage your projects"
          action={<CreateProject />}
        />
        <ProjectSearch />
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
};
