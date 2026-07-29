"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

type Item = {
  title: string;
  href: string;
  icon?: LucideIcon;
};

export function NavMain({ items }: { items: Item[] }) {
  const pathname = usePathname();

  const params = useParams();
  const projectId = params.projectId as string | undefined;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Projects
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const href = projectId
            ? `/projects/${projectId}/${item.href}`
            : `/${item.href}`;

          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={active}
                className="h-10 pl-3"
              >
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
