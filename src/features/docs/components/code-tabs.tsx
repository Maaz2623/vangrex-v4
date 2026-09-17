"use client";

import { useState } from "react";

import { cn } from "../lib/utils";
import { CopyButton } from "./copy-button";

export type CodeTab = {
  label: string;
  language?: string;
  code: string;
};

type CodeTabsProps = {
  tabs: CodeTab[];
};

export function CodeTabs({ tabs }: CodeTabsProps) {
  const [active, setActive] = useState(0);

  const current = tabs[active];

  return (
    <div className="my-6 overflow-hidden rounded-xl border bg-muted/40">
      <div className="flex items-center gap-1 overflow-x-auto border-b bg-muted/60 px-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "border-b-2 px-3 py-2 text-xs font-medium transition-colors",
              index === active
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs text-muted-foreground">
          {current.language ?? "text"}
        </span>

        <CopyButton value={current.code} />
      </div>

      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}
