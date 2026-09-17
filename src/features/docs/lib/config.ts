export const docsConfig = {
  name: "Vangrex",
  title: "Vangrex Documentation",
  description: "Build, orchestrate, and run AI-powered workflows with Vangrex.",

  links: {
    home: "/",
    docs: "/docs",
  },

  github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",

  sidebar: {
    width: 260,
  },

  toc: {
    width: 220,
  },
} as const;
