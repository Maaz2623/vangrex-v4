import { tool } from "ai";
import { z } from "zod";

import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { executeTool } from "../execution/execute-tool";
import { ExecutionContext } from "../execution/execution-context";
import { Workspace, workspaceManager } from "../workspace/workspace-manager";
import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";

export function createTerminalTool(
  node: ToolFlowNode,
  context: ExecutionContext,
  sandbox: SandboxInstance,
) {
  return tool({
    description:
      node.data.description ||
      "Execute a command inside the current execution workspace.",

    inputSchema: z.object({
      command: z.string().describe("The command or executable to run."),

      args: z
        .array(z.string())
        .optional()
        .describe("Arguments to pass to the command."),
    }),

    execute: async ({ command, args }) =>
      executeTool(node, context, async () => {
        const result = await sandbox.sandbox.commands.run(
          [command, ...(args ?? [])].join(" "),
          {
            envs: {
              GITHUB_TOKEN: githubToken
            }
          }
        );

        console.log({
          stderr: result.stderr,
          stdout: result.stdout,
        });

        return {
          command,
          args: args ?? [],
          stdout: result.stdout,
          stderr: result.stderr,
        };
      }),
  });
}
