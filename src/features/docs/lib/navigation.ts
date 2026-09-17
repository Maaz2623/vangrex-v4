import type { DocsNavSection } from "../types";

export const docsNavigation: DocsNavSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs/introduction",
        slug: ["introduction"],
      },
      {
        title: "Quickstart",
        href: "/docs/quickstart",
        slug: ["quickstart"],
      },
      {
        title: "Core Concepts",
        href: "/docs/core-concepts",
        slug: ["core-concepts"],
      },
      {
        title: "Authentication",
        href: "/docs/authentication",
        slug: ["authentication"],
      },
    ],
  },

  {
    title: "SDK",
    items: [
      {
        title: "Overview",
        href: "/docs/sdk/overview",
        slug: ["sdk", "overview"],
      },
      {
        title: "Installation",
        href: "/docs/sdk/installation",
        slug: ["sdk", "installation"],
      },
      {
        title: "Workflows",
        href: "/docs/sdk/workflows",
        slug: ["sdk", "workflows"],
      },
      {
        title: "Executions",
        href: "/docs/sdk/executions",
        slug: ["sdk", "executions"],
      },
      {
        title: "Errors",
        href: "/docs/sdk/errors",
        slug: ["sdk", "errors"],
      },
    ],
  },

  {
    title: "Workflows",
    items: [
      {
        title: "Overview",
        href: "/docs/workflows",
        slug: ["workflows", "overview"],
      },
      {
        title: "Creating Workflows",
        href: "/docs/workflows/creating-workflows",
        slug: ["workflows", "creating-workflows"],
      },
      {
        title: "Nodes",
        href: "/docs/workflows/nodes",
        slug: ["workflows", "nodes"],
      },
      {
        title: "Inputs & Outputs",
        href: "/docs/workflows/inputs-outputs",
        slug: ["workflows", "inputs-outputs"],
      },
      {
        title: "Execution",
        href: "/docs/workflows/execution",
        slug: ["workflows", "execution"],
      },
      {
        title: "Publishing",
        href: "/docs/workflows/publishing",
        slug: ["workflows", "publishing"],
      },
    ],
  },

  {
    title: "AI",
    items: [
      {
        title: "Overview",
        href: "/docs/ai",
        slug: ["ai", "overview"],
      },
      {
        title: "Agents",
        href: "/docs/ai/agents",
        slug: ["ai", "agents"],
      },
      {
        title: "Models",
        href: "/docs/ai/models",
        slug: ["ai", "models"],
      },
      {
        title: "Tools",
        href: "/docs/ai/tools",
        slug: ["ai", "tools"],
      },
      {
        title: "Prompts",
        href: "/docs/ai/prompts",
        slug: ["ai", "prompts"],
      },
    ],
  },
];

export function getAllDocSlugs() {
  return docsNavigation.flatMap((section) =>
    section.items
      .filter((item) => item.slug)
      .map((item) => item.slug as string[]),
  );
}

export function findNavItem(slug: string[]) {
  return docsNavigation
    .flatMap((section) => section.items)
    .find((item) => {
      if (!item.slug) return false;

      return (
        item.slug.length === slug.length &&
        item.slug.every((part, index) => part === slug[index])
      );
    });
}

export function getFlatNavigation() {
  return docsNavigation.flatMap((section) =>
    section.items.filter((item) => item.href),
  );
}

export function getPagination(slug: string[]) {
  const items = getFlatNavigation();

  const currentIndex = items.findIndex(
    (item) =>
      item.slug &&
      item.slug.length === slug.length &&
      item.slug.every((part, index) => part === slug[index]),
  );

  if (currentIndex === -1) {
    return {
      previous: undefined,
      next: undefined,
    };
  }

  return {
    previous: items[currentIndex - 1],
    next: items[currentIndex + 1],
  };
}
