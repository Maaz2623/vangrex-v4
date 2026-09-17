"use client";

import Link from "next/link";
import { Roboto_Mono } from "next/font/google";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

import { DocsSearch } from "./docs-search";
import { DocsMobileNav } from "./docs-mobile-nav";

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile navigation */}
        <div className="flex items-center md:hidden">
          <DocsMobileNav />
        </div>

        {/* Logo */}
        <Link
          href="/docs"
          className={cn(
            "flex min-w-0 items-center gap-2",
            "md:mr-auto",
            roboto.className,
          )}
        >
          <Logo width={34} height={34} />

          <span className="truncate text-sm font-semibold sm:text-base md:text-lg">
            Vangrex / Docs
          </span>
        </Link>

        {/* Actions */}
        <div className="ml-3 flex items-center gap-2">
          <DocsSearch />

          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
}
