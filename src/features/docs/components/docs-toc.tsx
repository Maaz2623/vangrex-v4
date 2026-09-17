import type { DocHeading } from "../types";
import { cn } from "../lib/utils";

type DocsTocProps = {
  headings: DocHeading[];
};

export function DocsToc({ headings }: DocsTocProps) {
  if (!headings.length) {
    return null;
  }

  return (
    <aside className="hidden w-[220px] shrink-0 xl:block">
      <div className="sticky top-24 py-8 pl-6">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </div>

        <nav className="border-l">
          {headings.map((heading, i) => (
            <a
              key={`${heading.id}-${heading.text}-${i}`}
              href={`#${heading.id}`}
              className={cn(
                "block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
                heading.level === 3 ? "pl-6" : "pl-4",
              )}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
