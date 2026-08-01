"use client";

import { ReactFlow, Background, Controls, MiniMap, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CanvasHeader } from "./canvas-header";
import { CanvasContextMenu } from "./canvas-context-menu";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { nodes } from "@/nodes";
import { nodeTypes } from "./nodes/node-registry";

type Props = {
  projectId: string;
  workflowId: string;
};

export const CanvasEditor = ({ projectId, workflowId }: Props) => {
  return (
    <div className="h-full w-full">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="h-full w-full">
            <ReactFlow colorMode="dark" nodes={nodes} nodeTypes={nodeTypes}>
              <MiniMap />
              <Background color="skyblue" />
              <Controls />

              <Panel position="top-left" className="w-full">
                <CanvasHeader projectId={projectId} workflowId={workflowId} />
              </Panel>
            </ReactFlow>
          </div>
        </ContextMenuTrigger>

        <CanvasContextMenu />
      </ContextMenu>
    </div>
  );
};
