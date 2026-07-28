import {
  BookOpenIcon,
  FolderKanbanIcon,
  KeyRoundIcon,
  SettingsIcon,
  WorkflowIcon,
} from "lucide-react";

export const projectDashboardData = {
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

export const dashboardData = {
  navMain: [
    {
      title: "Projects",
      href: "projects",
      icon: FolderKanbanIcon,
    },
  ],
};
