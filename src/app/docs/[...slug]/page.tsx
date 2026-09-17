import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsLayout } from "@/features/docs/components/docs-layout";
import { mdxComponents } from "@/features/docs/components/mdx-components";
import { getAllDocSlugs } from "@/features/docs/lib/navigation";
import { getDocBySlug } from "@/features/docs/lib/source";

import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

type DocsPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;

  const doc = getDocBySlug(slug);

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;

  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const { content } = await compileMDX({
    source: doc.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: mdxComponents,
  });

  return (
    <DocsLayout
      slug={doc.slug}
      title={doc.title}
      description={doc.description}
      headings={doc.headings}
    >
      {content}
    </DocsLayout>
  );
}
