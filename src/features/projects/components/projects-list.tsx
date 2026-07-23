"use client";

import { Calendar, MoreHorizontal, Star, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const projects = [
  {
    id: "1",
    name: "Vangrex",
    description:
      "AI software engineering platform for autonomous development workflows.",
    status: "Active",
    members: 8,
    updated: "2 hours ago",
    starred: true,
  },
  {
    id: "2",
    name: "Nodebase",
    description:
      "Workflow automation platform for AI agents and business processes.",
    status: "In Progress",
    members: 5,
    updated: "Yesterday",
    starred: false,
  },
  {
    id: "3",
    name: "Real Estate Landing",
    description:
      "High-converting landing page for premium real estate properties.",
    status: "Completed",
    members: 3,
    updated: "3 days ago",
    starred: false,
  },
  {
    id: "4",
    name: "Portfolio",
    description:
      "Personal portfolio showcasing projects, blogs, and experience.",
    status: "Draft",
    members: 1,
    updated: "1 week ago",
    starred: true,
  },
  {
    id: "5",
    name: "AI CRM",
    description:
      "Customer relationship management platform powered by AI insights.",
    status: "Planning",
    members: 6,
    updated: "5 hours ago",
    starred: false,
  },
  {
    id: "6",
    name: "Analytics Dashboard",
    description:
      "Business analytics dashboard with real-time metrics and reports.",
    status: "Active",
    members: 4,
    updated: "Today",
    starred: false,
  },
];

export function ProjectsList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="group">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{project.name}</CardTitle>

                {project.starred && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>

              <Badge variant="secondary">{project.status}</Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem>Open</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.description}
            </p>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {project.members} members
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {project.updated}
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
