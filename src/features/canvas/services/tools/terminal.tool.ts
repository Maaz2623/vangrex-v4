import { tool } from "ai";
import { z } from "zod";

import { ToolFlowNode } from "../../components/nodes/types/tool-node";
import { executeTool } from "../execution/execute-tool";
import { ExecutionContext } from "../execution/execution-context";
import { Workspace, workspaceManager } from "../workspace/workspace-manager";
import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";
import { getGithubConnection } from "@/features/github/services/github-connection-service";

export function createTerminalTool(
  node: ToolFlowNode,
  context: ExecutionContext,
  sandbox: SandboxInstance,
  userId: string,
) {
  return tool({
    description: `
Execute commands inside the current sandbox.

When performing GitHub operations:
1. Use the GitHub connectionId from the upstream GitHub configuration.
2. Pass that connectionId as githubConnectionId in the tool call.
3. Do not ask the user to provide a token.
4. Do not run gh auth login.
5. Do not assume GitHub is unauthenticated.

Example:

{
  "command": "gh repo create khans --private",
  "githubConnectionId": "<connectionId from GitHub node>"
}
`,

    inputSchema: z.object({
      command: z
        .string()
        .describe(
          "The COMPLETE shell command to execute. Include the executable and every argument.",
        ),

      githubConnectionId: z
        .string()
        .optional()
        .describe(
          "The connectionId from the upstream GitHub node. REQUIRED for GitHub commands.",
        ),
    }),

    execute: async ({ command, githubConnectionId }) =>
      executeTool(node, context, async () => {
        let env: Record<string, string> | undefined;

        if (githubConnectionId) {
          const connection = await getGithubConnection(
            userId,
            githubConnectionId,
          );

          env = {
            GH_TOKEN: connection.accessToken,
          };

          console.log("[terminal] github auth: connection supplied");
        } else {
          console.log("[terminal] github auth: no connection");
        }

        console.log("[terminal] command:", command);

        const result = await sandbox.sandbox.commands.run(command, {
          envs: env,
        });

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
