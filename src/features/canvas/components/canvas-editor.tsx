"use client";

import { ReactFlow, Background, Controls, MiniMap, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CanvasHeader } from "./canvas-header";

type Props = {
  projectId: string;
  workflowId: string;
};

export const CanvasEditor = ({ projectId, workflowId }: Props) => {
  return (
    <div className="h-full w-full">
      <ReactFlow colorMode="dark">
        <MiniMap />
        <Background />
        <Controls />
        <Panel position="top-left" className="w-full">
          <CanvasHeader projectId={projectId} workflowId={workflowId} />
        </Panel>
      </ReactFlow>
    </div>
  );
};
