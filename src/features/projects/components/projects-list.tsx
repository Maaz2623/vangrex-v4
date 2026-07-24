"use client";

import {
  BoxIcon,
  Calendar,
  Globe,
  Icon,
  Lock,
  MoreHorizontal,
  PlusIcon,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useDeleteProject } from "../hooks/use-projects";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CreateProject } from "./create-project";

export function ProjectsList() {
  const trpc = useTRPC();

  const { data: projects } = useSuspenseQuery(
    trpc.projects.getProjects.queryOptions(),
  );

  const deleteProject = useDeleteProject();

  console.log(projects);

  if (projects.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BoxIcon />
          </EmptyMedia>
          <EmptyTitle>No Projects Yet</EmptyTitle>
          <EmptyDescription>
            You haven't created any projects yet. Get started by creating your
            first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateProject />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="transition-colors hover:border-primary/30"
        >
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="line-clamp-1 text-lg">
                {project.name}
              </CardTitle>

              <Badge variant={project.archived ? "secondary" : "outline"}>
                {project.archived ? "Archived" : "Active"}
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>Open</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>
                  {project.archived ? "Restore" : "Archive"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    deleteProject.mutate({
                      projectId: project.id,
                    })
                  }
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="min-h-10 line-clamp-2 text-sm text-muted-foreground">
              {project.description || "No description provided."}
            </p>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {project.visibility === "private" ? (
                  <Lock className="size-4" />
                ) : project.visibility === "team" ? (
                  <Users className="size-4" />
                ) : (
                  <Globe className="size-4" />
                )}

                <span className="capitalize">{project.visibility}</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                <span>
                  {formatDistanceToNow(project.updatedAt, {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">Open</Button>

              <Button variant="outline" className="flex-1">
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
