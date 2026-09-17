import { CopyButton } from "./copy-button";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border bg-muted/40">
      <div className="flex h-10 items-center justify-between border-b bg-muted/60 px-4">
        <span className="text-xs font-medium text-muted-foreground">
          {language}
        </span>

        <CopyButton value={code} />
      </div>

      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}
