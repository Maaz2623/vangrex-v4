"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type Item = {
  title: string;
  href: string;
  icon?: LucideIcon;
};

export function NavMain({ items }: { items: Item[] }) {
  const pathname = usePathname();

  const { projectId, workflowId } = useParams<{
    projectId?: string;
    workflowId?: string;
  }>();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          let href = `/${item.href}`;

          if (workflowId) {
            href = `/projects/${projectId}/workflows/${workflowId}/${item.href}`;
          } else if (projectId) {
            href = `/projects/${projectId}/${item.href}`;
          }

          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton asChild isActive={active} className="h-10">
                <Link href={href}>
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
