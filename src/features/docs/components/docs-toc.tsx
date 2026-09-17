"use client";

import { useEffect, useState } from "react";

import type { DocHeading } from "../types";
import { cn } from "../lib/utils";

type DocsTocProps = {
  headings: DocHeading[];
};

export function DocsToc({ headings }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;

    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headingElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0].target.id);
          return;
        }

        // If nothing is currently intersecting, determine
        // which heading is closest to the top of the viewport.
        const current = headingElements
          .filter((element) => element.getBoundingClientRect().top <= 120)
          .at(-1);

        if (current) {
          setActiveId(current.id);
        }
      },
      {
        rootMargin: "-100px 0px -65% 0px",
        threshold: 0,
      },
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) {
    return null;
  }

  return (
    <aside className="hidden w-[220px] shrink-0 xl:block">
      <div className="sticky top-24 py-8 pl-6">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </div>

        <nav className="relative border-l">
          {headings.map((heading, i) => {
            const active = activeId === heading.id;

            return (
              <a
                key={`${heading.id}-${heading.text}-${i}`}
                href={`#${heading.id}`}
                className={cn(
                  "relative block py-1 text-sm transition-colors",
                  heading.level === 3 ? "pl-6" : "pl-4",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute -left-px top-0 h-full w-px bg-foreground" />
                )}

                {heading.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
