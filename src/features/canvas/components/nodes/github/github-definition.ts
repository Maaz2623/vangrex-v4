import { GithubConfig } from "../types";
import { NodeDefinition } from "../types/node-definition";
import { FaGithub } from "react-icons/fa";
import { defaultGithubConfig } from "./defaults";
import { Position } from "@xyflow/react";
import { GitHubNode } from "./github-node";

export const githubDefinition: NodeDefinition<GithubConfig> = {
  type: "github",
  name: "Github",
  description: "Create, manage, and publish projects to Github",

  icon: FaGithub,

  component: GitHubNode,

  defaultConfig: defaultGithubConfig,

  handles: [
    {
      id: "input",
      name: "Input",
      direction: "target",
      position: Position.Left,
      dataType: "text",
    },
    {
      id: "output",
      name: "Output",
      direction: "source",
      position: Position.Right,
      dataType: "text",
    },
  ],
};
