import "server-only";

import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveAgentDebug(
  executionId: string | undefined,
  result: any,
) {
  const dir = path.join(process.cwd(), ".vangrex", "debug");

  await mkdir(dir, { recursive: true });

  const steps = result.steps.map((step: any, index: number) => ({
    step: index + 1,

    text: step.text ?? null,

    finishReason: step.finishReason ?? null,

    toolCalls:
      step.toolCalls?.map((call: any) => ({
        toolName: call.toolName,
        toolCallId: call.toolCallId,
        input: call.input,
      })) ?? [],

    toolResults:
      step.toolResults?.map((result: any) => ({
        toolName: result.toolName,
        toolCallId: result.toolCallId,
        input: result.input,
        output: result.output,
      })) ?? [],
  }));

  const debug = {
    executionId: executionId ?? null,

    stepsUsed: result.steps.length,

    finishReason: result.finishReason ?? null,

    finalText: result.text ?? null,

    steps,
  };

  const filePath = path.join(dir, `${executionId ?? Date.now()}.json`);

  await writeFile(filePath, JSON.stringify(debug, null, 2), "utf8");

  console.log(`[agent-debug] saved: ${filePath}`);
}
