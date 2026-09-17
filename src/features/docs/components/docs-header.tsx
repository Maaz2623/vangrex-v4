import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { docsConfig } from "../lib/config";
import { DocsMobileNav } from "./docs-mobile-nav";
import { DocsSearch } from "./docs-search";

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center px-4">
        <div className="flex items-center gap-2">
          <DocsMobileNav />

          <Link
            href={docsConfig.links.docs}
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
              V
            </span>

            <span className="hidden sm:inline">{docsConfig.name}</span>

            <span className="hidden text-muted-foreground sm:inline">/</span>

            <span className="hidden text-muted-foreground sm:inline">Docs</span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <DocsSearch />
          </div>

          <Link
            href={docsConfig.links.home}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Back to Vangrex"
          >
            <ArrowLeft className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
