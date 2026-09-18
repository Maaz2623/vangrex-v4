#!/usr/bin/env node

import "dotenv/config";

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { fetchWorkflowTypes } from "./workflow-generator.js";

interface CliOptions {
  apiKey?: string;
  baseUrl?: string;
  output: string;
}

const DEFAULT_OUTPUT = "vangrex/vangrex-workflows.ts";

function printHelp(): void {
  console.log(`
Vangrex CLI

Generate TypeScript types from your Vangrex workflows.

Usage:
  vangrex generate

Options:
  --api-key <key>       Vangrex API key
  --base-url <url>      Vangrex API base URL
  --output <path>       Output file
  -o <path>             Alias for --output
  --help, -h            Show this help

Environment:
  VANGREX_API_KEY       Vangrex API key
  VANGREX_BASE_URL      Vangrex API base URL

Defaults:
  Output:
    ${DEFAULT_OUTPUT}

Examples:
  vangrex generate

  vangrex generate --output src/vangrex-workflows.ts

  vangrex generate --api-key vx_live_xxx
`);
}

function getNextArg(args: string[], index: number, option: string): string {
  const value = args[index + 1];

  if (!value || value.startsWith("-")) {
    throw new Error(`${option} requires a value`);
  }

  return value;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    output: DEFAULT_OUTPUT,
  };

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];

    switch (arg) {
      case "--api-key":
        options.apiKey = getNextArg(args, index, "--api-key");
        index++;
        break;

      case "--base-url":
        options.baseUrl = getNextArg(args, index, "--base-url");
        index++;
        break;

      case "--output":
      case "-o":
        options.output = getNextArg(args, index, arg);
        index++;
        break;

      case "--help":
      case "-h":
        printHelp();
        process.exit(0);

      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

async function generate(options: CliOptions): Promise<void> {
  const apiKey = options.apiKey ?? process.env.VANGREX_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Vangrex API key is required.\n\n" +
        "Set VANGREX_API_KEY in your environment or use --api-key.",
    );
  }

  const baseUrl = options.baseUrl ?? process.env.VANGREX_BASE_URL;

  const outputPath = resolve(process.cwd(), options.output);

  console.log("Fetching Vangrex workflows...");

  const generatedTypes = await fetchWorkflowTypes({
    apiKey,
    baseUrl,
  });

  await mkdir(dirname(outputPath), {
    recursive: true,
  });

  await writeFile(outputPath, generatedTypes, "utf8");

  console.log(`✓ Generated ${options.output}`);
}

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;

  if (!command || command === "help") {
    printHelp();
    return;
  }

  if (command !== "generate") {
    throw new Error(`Unknown command: ${command}`);
  }

  const options = parseArgs(args);

  await generate(options);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";

  console.error(`\n✗ ${message}\n`);

  process.exit(1);
});
