import { Box } from "lucide-react";
import { NodeDefinition } from "../types/node-definition";
import { SandboxConfig } from "../types/sandbox-node";
import { Position } from "@xyflow/react";
import { SandboxNode } from "./sandbox-node";

export const sandboxDefinition: NodeDefinition<SandboxConfig> = {
  type: "sandbox",
  name: "Sandbox",
  description: "Provides an isolated execution environment.",
  icon: Box,

  // We'll create SandboxNode in the next step.
  component: SandboxNode,

  handles: [
    {
      id: "input",
      name: "Input",
      direction: "target",
      position: Position.Left,
      dataType: "any",
    },
    {
      id: "output",
      name: "Output",
      direction: "source",
      position: Position.Right,
      dataType: "any",
    },
  ],

  defaultConfig: {
    provider: "e2b",
  },
};
