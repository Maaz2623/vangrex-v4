"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CanvasHeader } from "./canvas-header";
import { CanvasContextMenu } from "./canvas-context-menu";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { initialNodes } from "@/nodes";
import { nodeTypes } from "./nodes/node-registry";
import { useCanvasStore } from "../store/canvas-store";

type Props = {
  projectId: string;
  workflowId: string;
};

export const CanvasEditor = ({ projectId, workflowId }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const { setSelectedNode } = useCanvasStore();

  return (
    <div className="h-full w-full">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="h-full w-full">
            <ReactFlow
              onSelectionChange={({ nodes }) => {
                setSelectedNode(nodes[0]?.id ?? null);
              }}
              colorMode="dark"
              nodes={nodes}
              onNodesChange={onNodesChange}
              nodeTypes={nodeTypes}
            >
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
