// tool-implementation.ts

export const ToolImplementations = {
  WEATHER: "weather",
  READ_FILE: "read_file",
  WRITE_FILE: "write_file",
  TERMINAL: "terminal",
  GITHUB_CREATE_REPOSITORY: "github_create_repository",
} as const;

export type ToolImplementation =
  (typeof ToolImplementations)[keyof typeof ToolImplementations];
