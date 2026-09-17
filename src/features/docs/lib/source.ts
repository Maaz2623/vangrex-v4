import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { DocHeading, DocPage } from "../types";
import { slugify } from "./utils";

const CONTENT_DIRECTORY = path.join(
  process.cwd(),
  "src",
  "features",
  "docs",
  "content",
);

function getContentPath(slug: string[]) {
  return path.join(CONTENT_DIRECTORY, ...slug) + ".mdx";
}

function extractHeadings(content: string): DocHeading[] {
  const headings: DocHeading[] = [];

  const regex = /^#{2,3}\s+(.+)$/gm;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const rawText = match[1].trim();

    const text = rawText.replace(/[`*_]/g, "").trim();

    const level = match[0].startsWith("###") ? 3 : 2;

    headings.push({
      id: slugify(text),
      text,
      level,
    });
  }

  return headings;
}

export function getDocBySlug(slug: string[]): DocPage | null {
  const filePath = getContentPath(slug);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const file = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(file);

  return {
    slug,
    title: data.title ?? slug[slug.length - 1],
    description: data.description,
    content,
    headings: extractHeadings(content),
  };
}

export function getAllDocs(): DocPage[] {
  const docs: DocPage[] = [];

  function walk(directory: string, slug: string[] = []) {
    if (!fs.existsSync(directory)) {
      return;
    }

    const entries = fs.readdirSync(directory, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, [...slug, entry.name]);
        continue;
      }

      if (!entry.name.endsWith(".mdx")) {
        continue;
      }

      const name = entry.name.replace(/\.mdx$/, "");

      const doc = getDocBySlug([...slug, name]);

      if (doc) {
        docs.push(doc);
      }
    }
  }

  walk(CONTENT_DIRECTORY);

  return docs;
}
