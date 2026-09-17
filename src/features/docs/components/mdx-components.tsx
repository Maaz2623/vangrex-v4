import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { CodeTabs } from "./code-tabs";
import { Step, Steps } from "./steps";

function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }

  if (typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }

  return "";
}

function createHeadingId(children: React.ReactNode) {
  return getTextContent(children)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1
      {...props}
      className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl"
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => {
    const id = createHeadingId(children);

    return (
      <h2
        id={id}
        {...props}
        className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
      >
        {children}
      </h2>
    );
  },

  h3: ({ children, ...props }) => {
    const id = createHeadingId(children);

    return (
      <h3
        id={id}
        {...props}
        className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
      >
        {children}
      </h3>
    );
  },

  p: ({ children, ...props }) => (
    <p {...props} className="my-5 leading-7 text-muted-foreground">
      {children}
    </p>
  ),

  ul: ({ children, ...props }) => (
    <ul
      {...props}
      className="my-5 ml-6 list-disc space-y-2 text-muted-foreground"
    >
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol
      {...props}
      className="my-5 ml-6 list-decimal space-y-2 text-muted-foreground"
    >
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li {...props} className="leading-7">
      {children}
    </li>
  ),

  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="my-6 border-l-2 pl-6 italic text-muted-foreground"
    >
      {children}
    </blockquote>
  ),

  hr: (props) => <hr {...props} className="my-10 border-border" />,

  a: ({ href, children, ...props }) => {
    if (!href) {
      return <span {...props}>{children}</span>;
    }

    const internal = href.startsWith("/");

    if (internal) {
      return (
        <Link
          href={href}
          {...props}
          className="font-medium text-foreground underline underline-offset-4"
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        {...props}
        className="font-medium text-foreground underline underline-offset-4"
      >
        {children}
      </a>
    );
  },

  code: ({ children, ...props }) => (
    <code
      {...props}
      className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
    >
      {children}
    </code>
  ),

  pre: ({ children }) => {
    const child = children as React.ReactElement<{
      children?: React.ReactNode;
      className?: string;
    }>;

    const code = getTextContent(child?.props?.children);

    const language =
      child?.props?.className?.replace("language-", "")?.trim() ?? "text";

    return <CodeBlock code={code} language={language} />;
  },

  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-xl border">
      <table {...props} className="w-full text-sm">
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }) => (
    <thead {...props} className="border-b bg-muted/50">
      {children}
    </thead>
  ),

  th: ({ children, ...props }) => (
    <th {...props} className="px-4 py-3 text-left font-medium">
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td {...props} className="border-t px-4 py-3 text-muted-foreground">
      {children}
    </td>
  ),

  Callout,
  CodeBlock,
  CodeTabs,
  Steps,
  Step,
};
