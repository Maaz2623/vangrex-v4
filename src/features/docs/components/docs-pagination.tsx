import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getPagination } from "../lib/navigation";

type DocsPaginationProps = {
  slug: string[];
};

export function DocsPagination({ slug }: DocsPaginationProps) {
  const { previous, next } = getPagination(slug);

  if (!previous && !next) {
    return null;
  }

  return (
    <div className="mt-16 grid grid-cols-2 gap-4 border-t pt-8">
      {previous ? (
        <Link
          href={previous.href!}
          className="group rounded-xl border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowLeft className="size-3.5" />
            Previous
          </div>

          <div className="font-medium group-hover:underline">
            {previous.title}
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href!}
          className="group rounded-xl border p-4 text-right transition-colors hover:bg-muted/50"
        >
          <div className="mb-2 flex items-center justify-end gap-2 text-xs text-muted-foreground">
            Next
            <ArrowRight className="size-3.5" />
          </div>

          <div className="font-medium group-hover:underline">{next.title}</div>
        </Link>
      ) : null}
    </div>
  );
}
