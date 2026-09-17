"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";

import { docsNavigation } from "../lib/navigation";

type SearchItem = {
  title: string;
  href: string;
  section: string;
  description?: string;
};

export function DocsSearch() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = useMemo<SearchItem[]>(() => {
    return docsNavigation.flatMap((section) =>
      section.items
        .filter((item) => Boolean(item.href))
        .map((item) => ({
          title: item.title,
          href: item.href!,
          section: section.title,
          description: item.description,
        })),
    );
  }, []);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items.slice(0, 8);
    }

    const scored = items
      .map((item) => {
        const title = item.title.toLowerCase();
        const section = item.section.toLowerCase();
        const description = item.description?.toLowerCase() ?? "";

        let score = 0;

        if (title === normalizedQuery) {
          score += 100;
        }

        if (title.startsWith(normalizedQuery)) {
          score += 75;
        }

        if (title.includes(normalizedQuery)) {
          score += 50;
        }

        if (section.includes(normalizedQuery)) {
          score += 25;
        }

        if (description.includes(normalizedQuery)) {
          score += 10;
        }

        return {
          item,
          score,
        };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.item);

    return scored.slice(0, 8);
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }

      if (
        event.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function navigateTo(href: string) {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();

    router.push(href);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = results[selectedIndex];

    if (result) {
      navigateTo(result.href);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "Enter") {
        setOpen(true);
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setSelectedIndex((current) =>
        current < results.length - 1 ? current + 1 : 0,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex((current) =>
        current > 0 ? current - 1 : results.length - 1,
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const result = results[selectedIndex];

      if (result) {
        navigateTo(result.href);
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full md:w-64 lg:w-72">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 z-10",
              "size-4 -translate-y-1/2",
              "text-muted-foreground",
            )}
          />

          <input
            ref={inputRef}
            name="query"
            value={query}
            autoComplete="off"
            placeholder="Search documentation..."
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              "h-9 w-full",
              "border bg-muted/40",
              "pl-9 pr-12",
              "text-sm",
              "outline-none",
              "transition-colors",
              "placeholder:text-muted-foreground",
              "focus:border-foreground/30",
              "focus:bg-background",
            )}
          />

          <kbd
            className={cn(
              "pointer-events-none absolute right-2 top-1/2",
              "-translate-y-1/2",
              "hidden items-center gap-0.5",
              "text-[10px] text-muted-foreground",
              "lg:flex",
            )}
          >
            <span className="rounded border bg-background px-1.5 py-0.5">
              /
            </span>
          </kbd>
        </div>
      </form>

      {/* Search results */}
      {open && (
        <div
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+0.5rem)]",
            "z-50",
            "overflow-hidden",
            "border bg-background",
            "shadow-lg",
          )}
        >
          {/* Results header */}
          <div className="flex h-9 items-center border-b px-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {query.trim() ? "Results" : "Documentation"}
            </span>
          </div>

          {results.length > 0 ? (
            <div className="max-h-[min(420px,60vh)] overflow-y-auto p-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={item.href}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => navigateTo(item.href)}
                    className={cn(
                      "group flex w-full items-center gap-3",
                      "px-3 py-2.5",
                      "text-left",
                      "transition-colors",
                      isSelected ? "bg-muted" : "hover:bg-muted",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">
                          {item.title}
                        </span>

                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {item.section}
                        </span>
                      </div>

                      {item.description && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <ArrowRight
                      className={cn(
                        "size-3.5 shrink-0",
                        "text-muted-foreground",
                        "transition-transform",
                        isSelected
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-10 text-center">
              <Search className="mx-auto mb-3 size-5 text-muted-foreground/50" />

              <p className="text-sm font-medium">No results found</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try searching for a different term.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex h-9 items-center gap-3 border-t px-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1 py-0.5">↑</kbd>
              <kbd className="rounded border bg-muted px-1 py-0.5">↓</kbd>
              navigate
            </span>

            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1 py-0.5">↵</kbd>
              open
            </span>

            <span className="ml-auto flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1 py-0.5">esc</kbd>
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
