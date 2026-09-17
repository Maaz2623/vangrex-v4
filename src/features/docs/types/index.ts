export type DocsFrontmatter = {
  title: string;
  description?: string;
};

export type DocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type DocPage = {
  slug: string[];
  title: string;
  description?: string;
  content: string;
  headings: DocHeading[];
};

export type DocsNavItem = {
  title: string;
  href?: string;
  slug?: string[];
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};
