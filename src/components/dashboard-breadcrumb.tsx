"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectName } from "@/features/projects/hooks/use-projects";
import { Link2Icon, PenBoxIcon } from "lucide-react";
import { toast } from "sonner";
import { useGetWorkflowName } from "@/features/workflows/hooks/use-workflows";

const labels: Record<string, string> = {
  projects: "Projects",
  workflows: "Workflows",
  overview: "Overview",
  canvas: "Canvas",
  executions: "Executions",
  variables: "Variables",
  secrets: "Secrets",
  knowledge: "Knowledge",
  files: "Files",
  logs: "Logs",
  versions: "Versions",
  settings: "Settings",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const { projectId, workflowId } = useParams<{
    projectId?: string;
    workflowId?: string;
  }>();

  const { data: projectName, isLoading: projectLoading } = useGetProjectName(
    projectId!,
  );

  const { data: workflowName, isLoading: workflowLoading } = useGetWorkflowName(
    {
      projectId: projectId!,
      workflowId: workflowId!,
    },
  );

  const segments = pathname.split("/").filter(Boolean);

  const items: {
    href: string;
    title: string;
    isProject: boolean;
    isWorkflow: boolean;
    isLoading: boolean;
  }[] = [];

  let href = "";

  for (const segment of segments) {
    href += `/${segment}`;

    let title = labels[segment] ?? segment;

    if (segment === projectId) {
      title = projectName ?? "Project";
    }

    if (segment === workflowId) {
      // Replace with workflow name once you have the query
      title = workflowName ?? "Workflow";
    }

    items.push({
      href,
      title,
      isProject: segment === projectId,
      isWorkflow: segment === workflowId,
      isLoading:
        (segment === projectId && projectLoading) ||
        (segment === workflowId && workflowLoading),
    });
  }

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_APP_URL}${url}`,
      );

      toast.success("Link copied to clipboard.");
    } catch (error) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          const editable = item.isProject || item.isWorkflow;

          const breadcrumb = last ? (
            <BreadcrumbPage>{item.title}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={item.href}>{item.title}</Link>
            </BreadcrumbLink>
          );

          return (
            <div key={item.href} className="flex items-center gap-2">
              {index !== 0 && <BreadcrumbSeparator />}

              <BreadcrumbItem>
                {item.isLoading ? (
                  <Skeleton className="h-4 w-24 rounded-md" />
                ) : editable ? (
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      {breadcrumb}
                    </ContextMenuTrigger>

                    <ContextMenuContent className="w-52">
                      <ContextMenuLabel>
                        {item.isProject ? "Project" : "Workflow"}
                      </ContextMenuLabel>

                      <ContextMenuSeparator />

                      <ContextMenuItem
                        onClick={() => {
                          copyLink(item.href);
                        }}
                      >
                        <Link2Icon className="mr-2 h-4 w-4" />
                        Copy Link
                      </ContextMenuItem>

                      <ContextMenuItem>
                        <PenBoxIcon className="mr-2 h-4 w-4" />
                        Rename
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ) : (
                  breadcrumb
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
