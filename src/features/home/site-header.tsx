"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Roboto_Mono } from "next/font/google";
import Link from "next/link";

const roboto = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-7">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-border bg-background/80 px-4 backdrop-blur-xl sm:px-5"
      >
        <a
          href="#top"
          className={cn(
            "flex tracking-wider items-center text-xl -gap-2.5 font-semibold",
            roboto.className,
          )}
        >
          <Logo width={50} height={50} />
          Vangrex
        </a>

        <div className="hidden items-center gap-7 text-[13px] text-muted-foreground md:flex">
          <a
            href="#platform"
            className="transition-colors hover:text-foreground"
          >
            Platform
          </a>

          <a
            href="#workflows"
            className="transition-colors hover:text-foreground"
          >
            Workflows
          </a>

          <a href="#agents" className="transition-colors hover:text-foreground">
            Agents
          </a>

          <a
            href="#company"
            className="transition-colors hover:text-foreground"
          >
            Company
          </a>
        </div>

        <Button asChild>
          <Link
            href="/auth/sign-in"
            className="rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:border-foreground/35"
          >
            Get Started
          </Link>
        </Button>
      </motion.nav>
    </header>
  );
}
