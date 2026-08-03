import { ToolConfig } from "../types/tool-node";

export const defaultToolConfig: ToolConfig = {
  name: "weather",
  description: "Returns the current weather",
  implementation: "weather",
  parameters: {},
};
