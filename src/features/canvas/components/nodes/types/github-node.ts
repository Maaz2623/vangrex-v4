import { NodeConfig } from "../node-config";
import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export interface GithubOperations {
  createRepository: boolean;
  push: boolean;
  commit: boolean;
  createBranch: boolean;
  createPullRequest: boolean;
  createIssue: boolean;
}

export interface GithubRepositoryConfig {
  name: string;
  visibility: "public" | "private";
  owner?: string;
}

export interface GithubConfig extends NodeConfig {
  connectionId?: string;
  operations: GithubOperations;

  repository: GithubRepositoryConfig;
}

export type GithubNodeData = BaseNodeData<GithubConfig>

export type GithubFlowNode = FlowNode<GithubConfig, "github">;
