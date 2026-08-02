"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CanvasHeader } from "./canvas-header";
import { CanvasContextMenu } from "./canvas-context-menu";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { initialNodes } from "@/nodes";
import { nodeTypes } from "./nodes/node-registry";
import { useCanvasStore } from "../store/canvas-store";
import { edgeTypes } from "./edges/edge-definitions/edge-types";
import { initialEdges } from "@/edges";
import { useCallback, useEffect } from "react";
import { getConnectedTools } from "../services/graph/tool-resolver";
import { executeAgent } from "../services/execution/agent-executor";

type Props = {
  projectId: string;
  workflowId: string;
};

export const CanvasEditor = ({ projectId, workflowId }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { setSelectedNode, executeAgentId, setExecuteAgentId } =
    useCanvasStore();

  useEffect(() => {
    if (!executeAgentId) return;

    executeAgent(executeAgentId, nodes, edges);

    setExecuteAgentId(null);
  }, [executeAgentId, nodes, edges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log("Connected:", connection);
      setEdges((edges) => {
        const next = addEdge(
          {
            ...connection,
            type: "default",
            data: {
              config: {},
              metadata: {
                animated: false,
                disabled: false,
                executionCount: 0,
              },
            },
          },
          edges,
        );

        return next;
      });
    },
    [setEdges],
  );

  const tools = getConnectedTools("1", nodes, edges);

  console.log(tools);

  return (
    <div className="h-full w-full">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="h-full w-full">
            <ReactFlow
              onSelectionChange={({ nodes }) => {
                setSelectedNode(nodes[0]?.id ?? null);
              }}
              onConnect={onConnect}
              colorMode="dark"
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
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
