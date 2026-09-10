"use client";

import { useQuery } from "@tanstack/react-query";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";

import { useTRPC } from "@/trpc/client";

interface SandboxBrowserProps {
  sandboxId: string;
  port?: number;
}

export function SandboxBrowser({
  sandboxId,
  port = 3000,
}: SandboxBrowserProps) {
  const trpc = useTRPC();

  const preview = useQuery(
    trpc.sandbox.getPreviewUrl.queryOptions({
      sandboxId,
      port,
    }),
  );

  if (preview.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs text-muted-foreground">
          Connecting to sandbox...
        </p>
      </div>
    );
  }

  if (preview.error) {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <p className="text-sm font-medium">Preview unavailable</p>

          <p className="mt-1 text-xs text-muted-foreground">
            {preview.error.message}
          </p>
        </div>
      </div>
    );
  }

  const url = preview.data?.url;

  if (!url) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs text-muted-foreground">
          No preview URL available.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 w-full overflow-hidden">
      <WebPreview defaultUrl={url}>
        <WebPreviewNavigation>
          <WebPreviewUrl />
        </WebPreviewNavigation>

        <WebPreviewBody src={url} />
      </WebPreview>
    </div>
  );
}
