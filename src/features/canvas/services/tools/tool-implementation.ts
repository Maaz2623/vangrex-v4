// tool-implementation.ts

export const ToolImplementations = {
  WEATHER: "weather",
} as const;

export type ToolImplementation =
  (typeof ToolImplementations)[keyof typeof ToolImplementations];
