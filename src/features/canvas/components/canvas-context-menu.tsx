import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import {
  Bot,
  Brain,
  Boxes,
  Code2,
  Database,
  GitBranch,
  Globe,
  Plus,
  Sparkles,
  Workflow,
  Copy,
  ClipboardPasteIcon,
  ScanSearch,
  Trash2,
  VariableIcon,
} from "lucide-react";
import { useCreateNode } from "../hooks/node.hooks";
import { useCallback } from "react";
import { AppFlowNode } from "./nodes/node-config";
import { createFlowNode } from "../services/nodes/create-node";
import { useCanvasStore } from "../store/canvas-store";

interface Props {
  addNode: (
    type: "tool-call" | "agent" | "variable" | "output",
    position: {
      x: number;
      y: number;
    },
  ) => void;
}

export const CanvasContextMenu = ({ addNode }: Props) => {
  return (
    <ContextMenuContent className="w-64">
      <ContextMenuLabel>Canvas</ContextMenuLabel>

      <ContextMenuSeparator />

      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <Plus className="mr-2 h-4 w-4" />
          Add Node
        </ContextMenuSubTrigger>

        <ContextMenuSubContent className="w-56">
          <ContextMenuItem
            onClick={() =>
              addNode("agent", {
                x: 0,
                y: 0,
              })
            }
          >
            <Bot className="mr-2 h-4 w-4" />
            Agent
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() =>
              addNode("tool-call", {
                x: 0,
                y: 0,
              })
            }
          >
            <Boxes className="mr-2 h-4 w-4" />
            Tool
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() =>
              addNode("variable", {
                x: 0,
                y: 0,
              })
            }
          >
            <VariableIcon className="mr-2 h-4 w-4" />
            Variable
          </ContextMenuItem>

          <ContextMenuItem>
            <GitBranch className="mr-2 h-4 w-4" />
            Logic
          </ContextMenuItem>

          <ContextMenuItem>
            <Workflow className="mr-2 h-4 w-4" />
            Workflow
          </ContextMenuItem>

          <ContextMenuItem>
            <Code2 className="mr-2 h-4 w-4" />
            Code
          </ContextMenuItem>

          <ContextMenuItem>
            <Globe className="mr-2 h-4 w-4" />
            API
          </ContextMenuItem>

          <ContextMenuItem>
            <Brain className="mr-2 h-4 w-4" />
            Human Input
          </ContextMenuItem>

          <ContextMenuItem>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Generated...
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>

      <ContextMenuSeparator />

      <ContextMenuItem>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </ContextMenuItem>

      <ContextMenuItem>
        <ClipboardPasteIcon className="mr-2 h-4 w-4" />
        Paste
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem>
        <ScanSearch className="mr-2 h-4 w-4" />
        Fit View
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuItem className="text-destructive focus:text-destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Selection
      </ContextMenuItem>
    </ContextMenuContent>
  );
};
