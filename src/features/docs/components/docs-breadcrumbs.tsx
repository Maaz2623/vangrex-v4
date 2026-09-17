import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { docsNavigation } from "../lib/navigation";

type DocsBreadcrumbsProps = {
  slug: string[];
  title: string;
};

export function DocsBreadcrumbs({ slug, title }: DocsBreadcrumbsProps) {
  const section = docsNavigation.find((section) =>
    section.items.some((item) => item.slug?.join("/") === slug.join("/")),
  );

  return (
    <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/docs" className="transition-colors hover:text-foreground">
        Docs
      </Link>

      {section ? (
        <>
          <ChevronRight className="size-3.5" />

          <span>{section.title}</span>
        </>
      ) : null}

      <ChevronRight className="size-3.5" />

      <span className="text-foreground">{title}</span>
    </div>
  );
}
