import { MonitorIcon } from "lucide-react";
import { OutputConfig } from "../types";
import { NodeDefinition } from "../types/node-definition";
import { OutputNode } from "./output-node";
import { Position } from "@xyflow/react";

export const outputDefinition: NodeDefinition<OutputConfig> = {
  type: "output",

  name: "Output",

  description: "Displays the node results.",

  icon: MonitorIcon,

  component: OutputNode,

  handles: [
    {
      id: "input",
      name: "Input",
      direction: "target",
      position: Position.Left,
      dataType: "any",
    },
  ],

  defaultConfig: {},
} as const;
