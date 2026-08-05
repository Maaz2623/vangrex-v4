import { Variable } from "lucide-react";
import { NodeCategory, NodeDefinition } from "../types/node-definition";
import { VariableConfig } from "../types/variable-node";
import { Position } from "@xyflow/react";

export const variableDefinition: NodeDefinition<VariableConfig> = {
  type: "variable",

  title: "Variable",

  description: "Stores a value in the execution context.",

  category: NodeCategory.Data,

  icon: Variable,

  handles: [
    {
      id: "output",
      name: "Output",
      direction: "source"
      position: Position.Right,
      dataType: "",
    },
  ],

  defaultConfig: {
    name: "",
    value: "",
  },
};
