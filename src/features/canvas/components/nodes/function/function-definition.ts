import { FunctionSquareIcon } from "lucide-react";

import { FunctionConfig } from "../types";
import { NodeCategory, NodeDefinition } from "../types/node-definition";

import { FunctionNode } from "./function-node";
import { defaultFunctionConfig } from "./defaults";
import { Position } from "@xyflow/react";

export const functionDefinition: NodeDefinition<FunctionConfig> = {
  type: "function",

  name: "Function",

  description: "Execute custom JavaScript/TypeScript code.",

  icon: FunctionSquareIcon,

  component: FunctionNode,

  defaultConfig: defaultFunctionConfig,

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
};
