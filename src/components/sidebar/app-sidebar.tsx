"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpenIcon,
  Command,
  FolderKanbanIcon,
  GalleryVerticalEnd,
  KeyRoundIcon,
  SettingsIcon,
  WorkflowIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser, NavUserSkeleton } from "./nav-user";

import { authClient } from "@/lib/auth-client";
import { useParams } from "next/navigation";

const dashboardData = {
  navMain: [
    {
      title: "Projects",
      href: "projects",
      icon: FolderKanbanIcon,
    },
  ],
};

const projectDashboardData = {
  navMain: [
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
  ],
  navSecondary: [
    {
      title: "Settings",
      href: "settings",
      icon: SettingsIcon,
    },
  ],
};

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
  const { projectId } = useParams<{ projectId?: string }>();

  const session = authClient.useSession();

  const isProjectPage = Boolean(projectId);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain
          items={
            isProjectPage ? projectDashboardData.navMain : dashboardData.navMain
          }
        />
      </SidebarContent>

      <SidebarFooter>
        {isProjectPage && <NavMain items={projectDashboardData.navSecondary} />}

        {!session.data?.user ? (
          <NavUserSkeleton />
        ) : (
          <NavUser user={session.data.user} />
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
