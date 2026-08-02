import { WrenchIcon } from "lucide-react";
import { NodeCategory, NodeDefinition } from "../types/node-definition";
import { ToolConfig } from "../types/tool-node";
import { defaultToolConfig } from "./defaults";
import { Position } from "@xyflow/react";
import { ToolNode } from "./tool-node";

export const toolDefinition: NodeDefinition<ToolConfig> = {
  type: "tool",

  name: "Tool",

  description: "Expose a callable tool to AI agents.",

  icon: WrenchIcon,

  component: ToolNode,

  defaultConfig: defaultToolConfig,

  handles: [
    {
      id: "tool",

      name: "Tool",

      direction: "source",

      position: Position.Right,

      dataType: "tool-call",
    },
  ],
};
