"use client";

import { Icon } from "@iconify/react";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";

interface FileIconProps {
  name: string;
  isDirectory?: boolean;
  open?: boolean;
}

export function FileIcon({
  name,
  isDirectory = false,
  open = false,
}: FileIconProps) {
  // Folders → React Icons Font Awesome
  if (isDirectory) {
    return open ? (
      <FaFolderOpen className="size-4 shrink-0" />
    ) : (
      <FaFolder className="size-4 shrink-0" />
    );
  }

  // Hidden/dot files → React Icons Font Awesome
  if (isDotFile(name)) {
    return <FaFile className="size-4 shrink-0" />;
  }

  const icon = getMaterialIcon(name);

  return (
    <Icon
      icon={`material-icon-theme:${icon}`}
      width={16}
      height={16}
      className="shrink-0"
    />
  );
}

function isDotFile(filename: string): boolean {
  const name = filename.trim();

  return name.startsWith(".") && name !== "." && name !== "..";
}

function getMaterialIcon(filename: string): string {
  const name = filename.toLowerCase();

  const specialFiles: Record<string, string> = {
    "package.json": "nodejs",
    "package-lock.json": "nodejs",
    "pnpm-lock.yaml": "pnpm",
    "yarn.lock": "yarn",
    "bun.lock": "bun",
    "bun.lockb": "bun",

    "tsconfig.json": "tsconfig",
    "tsconfig.base.json": "tsconfig",

    "vite.config.ts": "vite",
    "vite.config.js": "vite",
    "vite.config.mts": "vite",
    "vite.config.mjs": "vite",

    "next.config.js": "next",
    "next.config.mjs": "next",
    "next.config.ts": "next",

    "tailwind.config.js": "tailwind",
    "tailwind.config.ts": "tailwind",

    dockerfile: "docker",
    "docker-compose.yml": "docker",
    "docker-compose.yaml": "docker",
    "compose.yml": "docker",
    "compose.yaml": "docker",

    readme: "readme",
    "readme.md": "markdown",
    license: "license",
    "license.md": "license",
  };

  if (specialFiles[name]) {
    return specialFiles[name];
  }

  const extension = getExtension(name);

  const extensionIcons: Record<string, string> = {
    ts: "typescript",
    tsx: "react_ts",
    mts: "typescript",
    cts: "typescript",

    js: "javascript",
    jsx: "react",
    mjs: "javascript",
    cjs: "javascript",

    html: "html",
    htm: "html",
    css: "css",
    scss: "sass",
    sass: "sass",
    less: "less",

    json: "json",
    jsonc: "json",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    toml: "toml",
    csv: "csv",

    md: "markdown",
    mdx: "mdx",
    txt: "document",
    rst: "document",

    py: "python",
    pyw: "python",
    rs: "rust",
    go: "go",
    java: "java",
    kt: "kotlin",
    kts: "kotlin",

    c: "c",
    h: "c",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    hpp: "cpp",

    cs: "csharp",
    php: "php",
    rb: "ruby",
    swift: "swift",
    dart: "dart",
    lua: "lua",
    r: "r",
    scala: "scala",

    sh: "console",
    bash: "console",
    zsh: "console",
    fish: "console",
    ps1: "powershell",
    bat: "console",
    cmd: "console",

    sql: "database",

    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    webp: "image",
    bmp: "image",
    ico: "image",
    svg: "svg",

    ttf: "font",
    otf: "font",
    woff: "font",
    woff2: "font",

    zip: "zip",
    tar: "zip",
    gz: "zip",
    tgz: "zip",
    rar: "zip",
    "7z": "zip",

    pdf: "pdf",
    log: "document",

    ini: "settings",
    conf: "settings",
    config: "settings",
    properties: "settings",
  };

  return extensionIcons[extension] ?? "file";
}

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");

  if (lastDot === -1 || lastDot === filename.length - 1) {
    return "";
  }

  return filename.slice(lastDot + 1);
}
