import { Variable } from "lucide-react";
import { NodeCategory, NodeDefinition } from "../types/node-definition";
import { VariableConfig } from "../types/variable-node";
import { Position } from "@xyflow/react";
import { VariableNode } from "./variable-node";

export const variableDefinition: NodeDefinition<VariableConfig> = {
  type: "variable",
  name: "Variable",
  description: "Stores a value in the execution context.",
  component: VariableNode,

  icon: Variable,

  handles: [
    {
      id: "output",
      name: "Output",
      direction: "source",
      position: Position.Right,
      dataType: "any",
    },
  ],

  defaultConfig: {
    name: "",
    value: "",
  },
};
