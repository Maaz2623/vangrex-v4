import { ExecutionContext } from "./execution-context";

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
      return `{{${nodeName}}}`;
    }

    switch (output.type) {
      case "agent":
        return output.text;

      case "tool":
        return JSON.stringify(output.value, null, 2);

      default:
        return `{{${nodeName}}}`;
    }
  });
}
