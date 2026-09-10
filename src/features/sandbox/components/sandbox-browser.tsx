"use client";

import { useQuery } from "@tanstack/react-query";
import { RefreshCw, ExternalLink } from "lucide-react";

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewConsole,
} from "@/components/ai-elements/web-preview";

import { useTRPC } from "@/trpc/client";
import { useState } from "react";

interface SandboxBrowserProps {
  sandboxId: string;
  port?: number;
}

export function SandboxBrowser({
  sandboxId,
  port = 3000,
}: SandboxBrowserProps) {
  const trpc = useTRPC();

  const [previewKey, setPreviewKey] = useState(0);

  const handleReload = () => {
    setPreviewKey((key) => key + 1);
  };

  const preview = useQuery(
    trpc.sandbox.getPreviewUrl.queryOptions({
      sandboxId,
      port,
    }),
  );

  if (preview.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-xs text-muted-foreground">
          Connecting to sandbox...
        </span>
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
        <span className="text-xs text-muted-foreground">
          No preview URL available.
        </span>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 w-full overflow-hidden">
      <WebPreview defaultUrl={url} className="rounded-none border-0">
        <WebPreviewNavigation>
          {/* The component's existing navigation */}
          <WebPreviewNavigationButton tooltip="Reload" onClick={handleReload}>
            <RefreshCw className="size-3.5" />
          </WebPreviewNavigationButton>

          <WebPreviewUrl />

          <WebPreviewNavigationButton
            tooltip="Open in new tab"
            onClick={() => {
              window.open(url, "_blank", "noopener,noreferrer");
            }}
          >
            <ExternalLink className="size-3.5" />
          </WebPreviewNavigationButton>
        </WebPreviewNavigation>

        <WebPreviewBody src={url} />
      </WebPreview>
    </div>
  );
}
