import { ExecutionContext } from "./execution-context";
import { formatExecutionOutput } from "./output-formatter";

function resolvePath(value: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (typeof current === "object" && current !== null && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, value);
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function interpolatePrompt(
  prompt: string,
  context: ExecutionContext,
): string {
  return prompt.replace(/{{(.*?)}}/g, (_, rawName: string) => {
    const expression = rawName.trim();

    // -----------------------------------------
    // INPUT / WEBHOOK DATA
    // {{input.city}}
    // -----------------------------------------

    if (expression.startsWith("input.")) {
      const path = expression.slice("input.".length);

      const value = resolvePath(context.metadata?.input, path);

      return formatValue(value);
    }

    // -----------------------------------------
    // WORKFLOW VARIABLES
    // {{city}}
    // {{customer.name}}
    // -----------------------------------------

    const variableValue = resolvePath(context.variables, expression);

    if (variableValue !== undefined) {
      return formatValue(variableValue);
    }

    // -----------------------------------------
    // NODE OUTPUT
    // {{Agent}}
    // -----------------------------------------

    const nodeId = Object.entries(context.nodeNames).find(
      ([, name]) => name === expression,
    )?.[0];

    if (!nodeId) {
      return `{{${expression}}}`;
    }

    const output = context.outputs[nodeId];

    if (!output) {
      return "";
    }

    return formatExecutionOutput(output);
  });
}
