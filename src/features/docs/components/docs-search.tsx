"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { docsNavigation } from "../lib/navigation";

export function DocsSearch() {
  const router = useRouter();

  const items = docsNavigation.flatMap((section) =>
    section.items
      .filter((item) => item.href)
      .map((item) => ({
        ...item,
        section: section.title,
      })),
  );

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("query") ?? "")
      .trim()
      .toLowerCase();

    if (!query) return;

    const result = items.find((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.section.toLowerCase().includes(query)
      );
    });

    if (result?.href) {
      router.push(result.href);
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-64">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <input
        name="query"
        placeholder="Search documentation..."
        className="h-9 w-full rounded-md border bg-muted/40 pl-9 pr-3 text-sm outline-none transition focus:border-foreground/30 focus:bg-background"
      />

      <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground lg:block">
        /
      </kbd>
    </form>
  );
}
