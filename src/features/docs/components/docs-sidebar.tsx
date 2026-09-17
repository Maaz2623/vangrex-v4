import Link from "next/link";

import { cn } from "../lib/utils";
import { docsNavigation } from "../lib/navigation";

type DocsSidebarProps = {
  slug: string[];
};

export function DocsSidebar({ slug }: DocsSidebarProps) {
  return (
    <aside className="hidden w-[260px] shrink-0 border-r md:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-5 py-8">
        <nav className="space-y-8">
          {docsNavigation.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h2>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const active =
                    item.slug &&
                    item.slug.length === slug.length &&
                    item.slug.every((part, index) => part === slug[index]);

                  return (
                    <Link
                      key={item.href ?? item.title}
                      href={item.href ?? "#"}
                      className={cn(
                        "block rounded-md px-3 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      {item.title}
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
