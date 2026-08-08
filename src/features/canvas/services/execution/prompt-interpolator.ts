import { ExecutionContext } from "./execution-context";
import { formatExecutionOutput } from "./output-formatter";

export function interpolatePrompt(
  prompt: string,
  context: ExecutionContext,
): string {
  return prompt.replace(
    /{{(.*?)}}/g,
    (_match: string, rawName: string): string => {
      const nodeName = rawName.trim();

      const nodeId = Object.entries(context.nodeNames).find(
        ([, name]) => name === nodeName,
      )?.[0];

      // Keep unresolved variables untouched
      if (!nodeId) {
        return `{{${nodeName}}}`;
      }

      const output = context.outputs[nodeId];

      // Node exists but hasn't produced output yet
      if (!output) {
        return "";
      }

      return formatExecutionOutput(output);
    },
  );
}
