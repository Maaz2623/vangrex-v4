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

  const segments = pathname.split("/").filter(Boolean);

  const items = [];
  let href = "";

  for (const segment of segments) {
    href += `/${segment}`;

    let title = labels[segment] ?? segment;

    if (segment === projectId) {
        
      // Replace with project name from query later
      title = "Project";
    }

    if (segment === workflowId) {
      // Replace with workflow name later
      title = "Workflow";
    }

    items.push({
      href,
      title,
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <div key={item.href} className="flex items-center gap-2">
              {index !== 0 && <BreadcrumbSeparator />}

              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
