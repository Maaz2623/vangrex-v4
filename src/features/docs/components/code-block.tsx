import {
  codeToHtml,
  type BundledLanguage,
  type SpecialLanguage,
} from "shiki";

import { CopyButton } from "./copy-button";

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
};

const LANGUAGE_ALIASES: Record<
  string,
  BundledLanguage | SpecialLanguage
> = {
  ts: "typescript",
  typescript: "typescript",
  tsx: "tsx",

  js: "javascript",
  javascript: "javascript",
  jsx: "jsx",

  json: "json",

  bash: "bash",
  sh: "bash",
  shell: "bash",

  css: "css",
  html: "html",

  md: "markdown",
  markdown: "markdown",
  mdx: "mdx",

  yaml: "yaml",
  yml: "yaml",

  sql: "sql",

  python: "python",
  py: "python",

  rust: "rust",
  go: "go",
  java: "java",

  text: "text",
  plaintext: "text",
};

function normalizeLanguage(
  language: string,
): BundledLanguage | SpecialLanguage {
  return LANGUAGE_ALIASES[language.toLowerCase()] ?? "text";
}

export async function CodeBlock({
  code,
  language = "text",
  filename,
}: CodeBlockProps) {
  const normalizedLanguage = normalizeLanguage(language);

  const html = await codeToHtml(code, {
    lang: normalizedLanguage,
    theme: "github-dark",
  });

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border bg-muted/40">
      {/* Header */}
      <div className="flex h-10 items-center justify-between border-b bg-muted/60 px-4">
        <span className="truncate text-xs font-medium text-muted-foreground">
          {filename ?? language}
        </span>

        <CopyButton value={code} />
      </div>

      {/* Highlighted code */}
      <div className="overflow-x-auto">
        <div
          className="
            docs-code
            min-w-full
            [&_pre]:m-0
            [&_pre]:min-w-max
            [&_pre]:overflow-visible
            [&_pre]:bg-transparent
            [&_pre]:p-4
            [&_pre]:font-mono
            [&_pre]:text-[13px]
            [&_pre]:leading-6
            sm:[&_pre]:text-sm
          "
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </div>
    </div>
  );
}