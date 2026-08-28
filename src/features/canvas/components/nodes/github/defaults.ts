import { GithubConfig } from "../types";

export const defaultGithubConfig: GithubConfig = {
  connectionId: undefined,

  operations: {
    createRepository: true,
    push: true,
    commit: true,
    createBranch: false,
    createPullRequest: false,
    createIssue: false,
  },

  repository: {
    name: "",
    visibility: "private",
    owner: undefined,
  },
};
