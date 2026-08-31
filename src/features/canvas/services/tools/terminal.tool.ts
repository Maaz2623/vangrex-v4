import { tool } from "ai";
import { z } from "zod";

import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { executeTool } from "../execution/execute-tool";
import { ExecutionContext } from "../execution/execution-context";
import { sandboxManager } from "@/lib/sandbox/sandbox-manager";

export function createTerminalTool(
  node: ToolFlowNode,
  context: ExecutionContext,
) {
  return tool({
    description:
      "Execute a shell command inside the workflow sandbox. Use this to run commands, inspect files, create files, install packages, and perform other terminal operations.",

    inputSchema: z.object({
      command: z
        .string()
        .describe("The complete shell command to execute inside the sandbox."),
    }),

    execute: async ({ command }) =>
      executeTool(node, context, async () => {
        const sandboxId = context.metadata.sandboxId as string | undefined;

        if (!sandboxId) {
          throw new Error(
            "No sandbox available. Add a Sandbox node before using the Terminal tool.",
          );
        }

        const sandbox = await sandboxManager.get(sandboxId);

        console.log("[terminal] sandbox:", sandbox.id);
        console.log("[terminal] command:", command);

        const result = await sandbox.sandbox.commands.run(command);

        console.log({
          stderr: result.stderr,
          stdout: result.stdout,
        });

        return {
          command,
          stdout: result.stdout,
          stderr: result.stderr,
        };
      }),
  });
}
