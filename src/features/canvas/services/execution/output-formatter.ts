import { ExecutionOutput } from "./execution-output";

export function formatExecutionOutput(output: ExecutionOutput): string {
  switch (output.type) {
    case "agent":
      return output.text;
    case "tool":
      return JSON.stringify(output.value, null, 2);
    case "knowledge":
      return output.documents.join("\n");
    case "human":
      return String(output.value);
  }
}
