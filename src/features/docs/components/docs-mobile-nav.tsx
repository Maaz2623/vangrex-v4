"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { docsNavigation } from "../lib/navigation";

export function DocsMobileNav() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open documentation navigation"
            className="size-9 rounded-lg"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[300px] border-r border-border p-0 sm:w-[340px]"
        >
          <SheetHeader className="border-b border-border px-5 py-4 text-left">
            <SheetTitle className="text-sm font-semibold">
              Documentation
            </SheetTitle>
          </SheetHeader>

          <div className="h-[calc(100vh-73px)] overflow-y-auto px-4 py-6">
            <nav className="space-y-7">
              {docsNavigation.map((section) => (
                <div key={section.title}>
                  <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {section.title}
                  </div>

                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.href ?? item.title}
                        href={item.href ?? "#"}
                        className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
