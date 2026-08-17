import { tool } from "ai";
import { Workspace, WorkspaceManager } from "../../workspace/workspace-manager";
import z from "zod";

export function createWorkspaceTools(
  workspace: Workspace,
  workspaceManager: WorkspaceManager,
) {
  return {
    read_file: tool({
      description: "Read a file from current project workspace.",
      inputSchema: z.object({
        path: z.string().describe("Path relative to the project workspace"),
      }),
      execute: async ({ path }) => {
        const content = await workspaceManager.readFile(workspace, path);

        return {
          path,
          content,
        };
      },
    }),

    write_file: tool({
      description:
        "Create or overwrite a file in the current project workspace.",
      inputSchema: z.object({
        path: z.string().describe("Path relative to the project workspace"),
        content: z.string().describe("Complete file contents"),
      }),
      execute: async ({ path, content }) => {
        await workspaceManager.writeFile(workspace, path, content);

        return {
          success: true,
          path,
        };
      },
    }),
  };
}
