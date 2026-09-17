import Link from "next/link";
import {
  BookOpen,
  Bot,
  Boxes,
  CircleHelp,
  Code2,
  FileCode2,
  GitBranch,
  KeyRound,
  Layers3,
  Play,
  Puzzle,
  Rocket,
  Settings2,
  Terminal,
  Workflow,
} from "lucide-react";

import { cn } from "../lib/utils";
import { docsNavigation } from "../lib/navigation";

type DocsSidebarProps = {
  slug: string[];
};

const iconMap = {
  Introduction: BookOpen,
  Quickstart: Rocket,
  "Core Concepts": Layers3,
  Authentication: KeyRound,

  SDK: Code2,
  Overview: BookOpen,
  Installation: Terminal,
  Workflows: Workflow,
  Executions: Play,
  Errors: CircleHelp,

  // @ts-ignore
  Workflows: Workflow,
  "Creating Workflows": GitBranch,
  Nodes: Boxes,
  "Inputs & Outputs": FileCode2,
  Execution: Play,
  Publishing: Rocket,

  AI: Bot,
  Agents: Bot,
  Models: Settings2,
  Tools: Puzzle,
  Prompts: FileCode2,
} as const;

function getIcon(title: string) {
  return iconMap[title as keyof typeof iconMap] ?? FileCode2;
}

export function DocsSidebar({ slug }: DocsSidebarProps) {
  return (
    <aside className="hidden w-[260px] shrink-0 border-r md:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-5 py-8">
        <nav className="space-y-8">
          {docsNavigation.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h2>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    item.slug &&
                    item.slug.length === slug.length &&
                    item.slug.every((part, index) => part === slug[index]);

                  const Icon = getIcon(item.title);

                  return (
                    <Link
                      key={item.href ?? item.title}
                      href={item.href ?? "#"}
                      className={cn(
                        "group flex items-center gap-2.5 px-3 py-1.5 text-sm",
                        "transition-colors",
                        active
                          ? "font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active
                            ? "text-foreground"
                            : "text-muted-foreground/70 group-hover:text-foreground",
                        )}
                        strokeWidth={1.7}
                      />

                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
