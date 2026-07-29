"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  AudioWaveform,
  BlocksIcon,
  BookOpenIcon,
  BookOpenTextIcon,
  Command,
  FileIcon,
  FolderKanbanIcon,
  GalleryVerticalEnd,
  GaugeCircleIcon,
  HistoryIcon,
  KeyRoundIcon,
  LogsIcon,
  PlayIcon,
  SettingsIcon,
  VariableIcon,
  WorkflowIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser, NavUserSkeleton } from "./nav-user";

import { authClient } from "@/lib/auth-client";

const dashboardNav = [
  {
    title: "Projects",
    href: "projects",
    icon: FolderKanbanIcon,
  },
];

const projectNav = [
  {
    title: "Workflows",
    href: "workflows",
    icon: WorkflowIcon,
  },
  {
    title: "Knowledge",
    href: "knowledge",
    icon: BookOpenIcon,
  },
  {
    title: "Secrets",
    href: "secrets",
    icon: KeyRoundIcon,
  },
  {
    title: "Settings",
    href: "settings",
    icon: SettingsIcon,
  },
];

const workflowNav = [
  {
    title: "Overview",
    href: "overview",
    icon: GaugeCircleIcon,
  },
  {
    title: "Canvas",
    href: "canvas",
    icon: BlocksIcon,
  },
  {
    title: "Executions",
    href: "executions",
    icon: PlayIcon,
  },
  {
    title: "Variables",
    href: "variables",
    icon: VariableIcon,
  },
  {
    title: "Secrets",
    href: "secrets",
    icon: KeyRoundIcon,
  },
  {
    title: "Knowledge",
    href: "knowledge",
    icon: BookOpenTextIcon,
  },
  {
    title: "Files",
    href: "files",
    icon: FileIcon,
  },
  {
    title: "Logs",
    href: "logs",
    icon: LogsIcon,
  },
  {
    title: "Versions",
    href: "versions",
    icon: HistoryIcon,
  },
  {
    title: "Settings",
    href: "settings",
    icon: SettingsIcon,
  },
];

const teams = [
  {
    name: "Projects",
    logo: GalleryVerticalEnd,
    plan: "Workspace",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Enterprise",
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { projectId, workflowId } = useParams<{
    projectId?: string;
    workflowId?: string;
  }>();

  const { data } = authClient.useSession();

  const navItems = workflowId
    ? workflowNav
    : projectId
      ? projectNav
      : dashboardNav;

  const backLink = workflowId
    ? {
        label: "Back to Project",
        href: `/projects/${projectId}`,
      }
    : projectId
      ? {
          label: "Back to Projects",
          href: "/projects",
        }
      : null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        {backLink && (
          <>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                  variant={`outline`}
                    asChild
                    className="h-10 bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <Link href={backLink.href}>
                      <ArrowLeftIcon className="size-4" />
                      <span>{backLink.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator />
          </>
        )}

        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        {data?.user ? <NavUser user={data.user} /> : <NavUserSkeleton />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
