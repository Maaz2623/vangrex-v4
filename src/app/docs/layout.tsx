import type { Metadata } from "next";

import { docsConfig } from "@/features/docs/lib/config";

export const metadata: Metadata = {
  title: {
    default: docsConfig.title,
    template: `%s — ${docsConfig.name} Docs`,
  },
  description: docsConfig.description,
};

export default function DocsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen">{children}</div>;
}
