"use client";

import { NodeProps } from "@xyflow/react";
import { Copy, Settings2, Trash2 } from "lucide-react";


import { NodeShell } from "../base/node-shell";
import { NodeToolbarButton } from "../base/node-toolbar-button";


import { useCanvasStore } from "@/features/canvas/store/canvas-store";
import { useNodeSettingsStore } from "@/features/canvas/store/node-settings-store";
import { GithubFlowNode } from "../types";
import { githubDefinition } from "./github-definition";
import { GitHubNodePreview } from "./github-node-preview";

export const GitHubNode = ({
  id,
  data,
  selected,
}: NodeProps<GithubFlowNode>) => {
  const { deleteNode } = useCanvasStore();
  const { open } = useNodeSettingsStore();

  return (
    <NodeShell
      definition={githubDefinition}
      data={data}
      selected={selected}
      preview={<GitHubNodePreview data={data} />}
      toolbar={
        <>
          <NodeToolbarButton icon={Settings2} onClick={() => open(id)} />

          <NodeToolbarButton icon={Copy} />

          <NodeToolbarButton icon={Trash2} onClick={() => deleteNode(id)} />
        </>
      }
    />
  );
};
