import type { ReactNode } from "react";

import { DocsBreadcrumbs } from "./docs-breadcrumbs";
import { DocsHeader } from "./docs-header";
import { DocsPagination } from "./docs-pagination";
import { DocsSidebar } from "./docs-sidebar";
import { DocsToc } from "./docs-toc";

import type { DocHeading } from "../types";

type DocsLayoutProps = {
  slug: string[];
  title: string;
  description?: string;
  headings: DocHeading[];
  children: ReactNode;
};

export function DocsLayout({
  slug,
  title,
  description,
  headings,
  children,
}: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DocsHeader />

      <div className="mx-auto flex max-w-[1600px]">
        <DocsSidebar slug={slug} />

        <main className="min-w-0 flex-1">
          <div className="mx-auto flex max-w-[1100px]">
            <article className="min-w-0 flex-1 px-6 py-10 sm:px-10 lg:px-12">
              <DocsBreadcrumbs slug={slug} title={title} />

              <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                  {title}
                </h1>

                {description ? (
                  <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </header>

              <div className="docs-content">{children}</div>

              <DocsPagination slug={slug} />
            </article>

            <DocsToc headings={headings} />
          </div>
        </main>
      </div>
    </div>
  );
}
