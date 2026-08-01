import { FunctionSquareIcon } from "lucide-react";

import { FunctionConfig } from "../types";
import { NodeCategory, NodeDefinition } from "../types/node-definition";

import { FunctionNode } from "./function-node";
import { defaultFunctionConfig } from "./defaults";

export const functionDefinition: NodeDefinition<FunctionConfig> = {
  type: "function",

  name: "Function",

  description: "Execute custom JavaScript/TypeScript code.",

  category: NodeCategory.Tools,

  icon: FunctionSquareIcon,

  component: FunctionNode,

  defaultConfig: defaultFunctionConfig,
};
