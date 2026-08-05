import { ExecutionContext } from "./execution-context";
import { formatExecutionOutput } from "./output-formatter";

export function interpolatePrompt(
  prompt: string,
  context: ExecutionContext,
): string {
  return prompt.replace(/\{\{(.*?)\}\}/g, (_, rawName: string) => {
    const nodeName = rawName.trim();

    const nodeId = Object.entries(context.nodeNames).find(
      ([, name]) => name === nodeName,
    )?.[0];

    if (!nodeId) {
      return `{{${nodeName}}}`;
    }

    const output = context.outputs[nodeId];

    if (!output) {
      return ``;
    }

    return formatExecutionOutput(output);
  });
}
