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
  CodeXmlIcon,
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
    title: "API Keys",
    href: "api-keys",
    icon: CodeXmlIcon,
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        {data?.user ? <NavUser user={data.user} /> : <NavUserSkeleton />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
