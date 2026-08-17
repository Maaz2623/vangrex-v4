// tool-implementation.ts

export const ToolImplementations = {
  WEATHER: "weather",
  READ_FILE: "read_file",
} as const;

export type ToolImplementation =
  (typeof ToolImplementations)[keyof typeof ToolImplementations];
