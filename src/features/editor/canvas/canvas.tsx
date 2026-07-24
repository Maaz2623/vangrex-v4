"use client";
import { AddNodeButton } from "@/features/editor/components/add-node-button";
import { useGetNodes } from "@/features/nodes/hooks/use-node";
import { initialNodes } from "@/nodes";
import { initialEdges } from "@/nodes/edges";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export const Canvas = ({ projectId }: { projectId: string }) => {
  const { data: nodes } = useGetNodes(projectId);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        className="relative"
        nodes={initialNodes}
        edges={initialEdges}
        colorMode="dark"
      >
        <AddNodeButton projectId={projectId} />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
