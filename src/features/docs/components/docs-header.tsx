"use client";

import Link from "next/link";

import { Roboto_Mono } from "next/font/google";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

import { DocsSearch } from "./docs-search";

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export function DocsHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/docs"
          className={cn("flex items-center", roboto.className)}
        >
          <Logo width={38} height={38} />

          <span className="text-lg font-semibold">Vangrex / Docs</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <DocsSearch />

          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
}
