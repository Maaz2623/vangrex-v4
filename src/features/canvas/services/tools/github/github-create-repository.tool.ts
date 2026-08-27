import { tool } from "ai";
import z from "zod";

export function createGithubCreateRepositoryTool() {
  return tool({
    description:
      "Create a new Github repository for the authenticated vangrex user. Use this when a project needs a new GitHub repository before pushing code.",

    inputSchema: z.object({
      name: z
        .string()
        .min(1)
        .regex(
          /^[A-Za-z0-9._-]+$/,
          "Repository name contains invalid characters.",
        ),
      description: z.string().optional(),
      private: z.boolean().default(true),
    }),
    execute: async ({ name, description, private: isPrivate }) => {
      const token = process.env.GITHUB_TOKEN;

      if (!token) {
        throw new Error("GITHUB_TOKEN is not configured.");
      }

      const response = await fetch("https://api.github.com/user/repos", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2026-03-10",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          description,
          private: isPrivate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `GitHub repository creation failed with status ${response.status}`,
        );
      }

      return {
        success: true,
        id: data.id,
        name: data.name,
        fullName: data.full_name,
        private: data.private,
        defaultBranch: data.default_branch,
        cloneUrl: data.clone_url,
        htmlUrl: data.html_url,
      };
    },
  });
}
