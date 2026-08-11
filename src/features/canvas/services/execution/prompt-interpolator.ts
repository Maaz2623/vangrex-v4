import { ExecutionContext } from "./execution-context";
import { formatExecutionOutput } from "./output-formatter";

export function interpolatePrompt(
  prompt: string,
  context: ExecutionContext,
): string {
  return prompt.replace(/{{(.*?)}}/g, (_, rawName: string) => {
    const expression = rawName.trim();

    // -----------------------------------------
    // INPUT / WEBHOOK DATA
    // -----------------------------------------

    if (expression.startsWith("input.")) {
      const path = expression.slice("input.".length);

      const input = context.metadata?.input;

      if (
        typeof input !== "object" ||
        input === null ||
        Array.isArray(input)
      ) {
        return "";
      }

      const value = path
        .split(".")
        .reduce<unknown>((current, key) => {
          if (
            typeof current === "object" &&
            current !== null &&
            key in current
          ) {
            return (current as Record<string, unknown>)[key];
          }

          return undefined;
        }, input);

      if (value === undefined || value === null) {
        return "";
      }

      if (typeof value === "object") {
        return JSON.stringify(value);
      }

      return String(value);
    }

    // -----------------------------------------
    // NODE OUTPUT
    // -----------------------------------------

    const nodeName = expression;

    const nodeId = Object.entries(context.nodeNames).find(
      ([, name]) => name === nodeName,
    )?.[0];

    if (!nodeId) {
      return `{{${nodeName}}}`;
    }

    const output = context.outputs[nodeId];

    if (!output) {
      return "";
    }

    return formatExecutionOutput(output);
  });
}