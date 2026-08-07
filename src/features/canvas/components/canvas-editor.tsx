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

import { useCallback, useEffect, useRef } from "react";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

import { CanvasHeader } from "./canvas-header";
import { CanvasContextMenu } from "./canvas-context-menu";

import { nodeTypes } from "./nodes/node-registry";
import { edgeTypes } from "./edges/edge-definitions/edge-types";

import { useCanvasStore } from "../store/canvas-store";
import { useNodeSettingsStore } from "../store/node-settings-store";
import { useExecutionStore } from "../store/execution-store";

import { NodeSettingsSheet } from "./nodes/settings/node-settings-sheet";

import { AgentFlowNode, NodeStatusType } from "./nodes/types";
import { AppFlowNode } from "./nodes/node-config";

import { EdgeExecutionState } from "./edges/types/edge-status";

import { executionEvents } from "../services/execution/execution-events";
import { ExecutionManager } from "../services/execution/execution-manager";

import { useCreateNode, useDeleteNode, useGetNodes } from "../hooks/node.hooks";

import { useCreateEdge, useGetEdges } from "../hooks/edge.hooks";

import { dbEdgeToFlowEdge } from "../services/persistance/edge-mapper";
import { dbNodeToFlowNode } from "../services/persistance/node-mapper";

import { createFlowNode } from "../services/nodes/create-node";

import type { FlowEdge } from "./edges/types/base-edge";
import { defaultEdgeMetadata } from "./edges/default/defaults";

type Props = {
  projectId: string;
  workflowId: string;
};

export const CanvasEditor = ({ projectId, workflowId }: Props) => {
  /*
   * ------------------------------------------------------------
   * DATABASE DATA
   * ------------------------------------------------------------
   */

  const { data: dbNodes, isLoading: nodesLoading } = useGetNodes(workflowId);

  const { data: dbEdges, isLoading: edgesLoading } = useGetEdges(workflowId);

  const createEdgeMutation = useCreateEdge();

  /*
   * ------------------------------------------------------------
   * REACT FLOW STATE
   * ------------------------------------------------------------
   */

  const [nodes, setNodes, onNodesChange] = useNodesState<AppFlowNode>([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  /*
   * ------------------------------------------------------------
   * LOAD NODES FROM DATABASE
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (!dbNodes) return;

    setNodes(dbNodes.map(dbNodeToFlowNode));
  }, [dbNodes, setNodes]);

  /*
   * ------------------------------------------------------------
   * LOAD EDGES FROM DATABASE
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (!dbEdges) return;

    setEdges(dbEdges.map(dbEdgeToFlowEdge));
  }, [dbEdges, setEdges]);

  /*
   * ------------------------------------------------------------
   * CANVAS STORE
   * ------------------------------------------------------------
   */

  const { setSelectedNode, executeAgentId, setExecuteAgentId, setDeleteNode } =
    useCanvasStore();

  /*
   * ------------------------------------------------------------
   * NODE SETTINGS
   * ------------------------------------------------------------
   */

  const { selectedNodeId } = useNodeSettingsStore();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;

  /*
   * ------------------------------------------------------------
   * EXECUTION STORE
   * ------------------------------------------------------------
   */

  const { addLog } = useExecutionStore();

  /*
   * ------------------------------------------------------------
   * UPDATE NODE
   * ------------------------------------------------------------
   */

  const updateNode = useCallback(
    (nodeId: string, updater: (node: AppFlowNode) => AppFlowNode) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => (node.id === nodeId ? updater(node) : node)),
      );
    },
    [setNodes],
  );

  /*
   * ------------------------------------------------------------
   * UPDATE NODE STATUS
   * ------------------------------------------------------------
   */

  const updateNodeStatus = useCallback(
    (nodeId: string, status: NodeStatusType) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id !== nodeId) {
            return node;
          }

          return {
            ...node,
            data: {
              ...node.data,
              metadata: {
                ...node.data.metadata,
                status,
              },
            },
          } as AppFlowNode;
        }),
      );
    },
    [setNodes],
  );

  /*
   * ------------------------------------------------------------
   * UPDATE EDGE STATUS
   * ------------------------------------------------------------
   */

  const updateEdgeStatus = useCallback(
    (edgeId: string, status: EdgeExecutionState) => {
      setEdges((currentEdges) =>
        currentEdges.map((edge) => {
          if (edge.id !== edgeId) {
            return edge;
          }

          const data = edge.data;

          if (!data) {
            return edge;
          }

          const isRunning = status === "running";

          return {
            ...edge,

            animated: isRunning,

            data: {
              ...data,

              metadata: {
                ...data.metadata,

                executionState: status,
                animated: isRunning,
              },
            },
          };
        }),
      );
    },
    [setEdges],
  );

  /*
   * ------------------------------------------------------------
   * CONNECTION
   * ------------------------------------------------------------
   */

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: FlowEdge = {
        id: crypto.randomUUID(),

        source: connection.source,
        target: connection.target,

        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,

        type: "default",

        data: {
          config: {},

          metadata: {
            animated: false,
            disabled: false,
            executionCount: 0,
            executionState: "idle",
          },
        },
      };

      createEdgeMutation.mutate(
        {
          workflowId,

          edge: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,

            config: edge.data?.config ?? {},
            metadata: edge.data?.metadata ?? defaultEdgeMetadata,
          },
        },
        {
          onSuccess: () => {
            setEdges((currentEdges) => [...currentEdges, edge]);
          },

          onError: (error) => {
            console.error("Failed to create edge:", error);
          },
        },
      );
    },
    [workflowId, createEdgeMutation, setEdges],
  );

  /*
   * ------------------------------------------------------------
   * EXECUTION EVENTS
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const unsubscribe = executionEvents.subscribe((event) => {
      addLog(event);

      switch (event.type) {
        case "node:start":
          updateNodeStatus(event.nodeId, "running");
          break;

        case "node:success":
          updateNodeStatus(event.nodeId, "success");
          break;

        case "node:error":
          updateNodeStatus(event.nodeId, "error");
          break;

        case "tool:start":
          updateNodeStatus(event.nodeId, "running");
          break;

        case "tool:success":
          updateNodeStatus(event.nodeId, "success");
          break;

        case "tool:error":
          updateNodeStatus(event.nodeId, "error");
          break;

        case "edge:start":
          updateEdgeStatus(event.edgeId, "running");
          break;

        case "edge:success":
          updateEdgeStatus(event.edgeId, "success");
          break;

        case "edge:error":
          updateEdgeStatus(event.edgeId, "error");
          break;
      }
    });

    return unsubscribe;
  }, [addLog, updateNodeStatus, updateEdgeStatus]);

  /*
   * ------------------------------------------------------------
   * EXECUTE AGENT
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (!executeAgentId) {
      return;
    }

    const agent = nodes.find(
      (node): node is AgentFlowNode =>
        node.id === executeAgentId && node.type === "agent",
    );

    if (!agent) {
      setExecuteAgentId(null);
      return;
    }

    const manager = new ExecutionManager();

    manager.execute(nodes, edges);

    setExecuteAgentId(null);
  }, [executeAgentId, nodes, edges, setExecuteAgentId]);

  /*
   * ------------------------------------------------------------
   * CREATE NODE
   * ------------------------------------------------------------
   */

  const createNodeMutation = useCreateNode();

  const addNode = useCallback(
    (
      type: AppFlowNode["type"],
      position: {
        x: number;
        y: number;
      },
    ) => {
      const node = createFlowNode(type, position);

      createNodeMutation.mutate(
        {
          workflowId,
          node,
        },

        {
          onSuccess: () => {
            setNodes((currentNodes) => [...currentNodes, node]);
          },

          onError: (error) => {
            console.error("Failed to create node:", error);
          },
        },
      );
    },
    [workflowId, createNodeMutation, setNodes],
  );

  /*
   * ------------------------------------------------------------
   * DELETE NODE
   * ------------------------------------------------------------
   */

  const deleteNodeMutation = useDeleteNode();

  const removeNode = useCallback(
    (nodeId: string) => {
      deleteNodeMutation.mutate(
        {
          id: nodeId,
        },

        {
          onSuccess: () => {
            setNodes((currentNodes) =>
              currentNodes.filter((node) => node.id !== nodeId),
            );

            setSelectedNode(null);
          },

          onError: (error) => {
            console.error("Failed to delete node:", error);
          },
        },
      );
    },

    [deleteNodeMutation, setNodes, setSelectedNode],
  );

  /*
   * ------------------------------------------------------------
   * REGISTER DELETE HANDLER
   * ------------------------------------------------------------
   */

  const deleteNodeRef = useRef(removeNode);

  useEffect(() => {
    deleteNodeRef.current = removeNode;
  }, [removeNode]);

  useEffect(() => {
    setDeleteNode((nodeId: string) => {
      deleteNodeRef.current(nodeId);
    });
  }, [setDeleteNode]);

  /*
   * ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------
   */

  if (nodesLoading || edgesLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading workflow...</p>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------
   */

  return (
    <div className="flex h-full w-full">
      {/* ------------------------------------------------------- */}
      {/* CANVAS */}
      {/* ------------------------------------------------------- */}

      <div className="flex-1">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="h-full w-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={({ nodes: selectedNodes }) => {
                  setSelectedNode(selectedNodes[0]?.id ?? null);
                }}
                colorMode="dark"
                fitView
              >
                <MiniMap />

                <Background />

                <Controls />

                <Panel position="top-left" className="w-full">
                  <CanvasHeader projectId={projectId} workflowId={workflowId} />
                </Panel>
              </ReactFlow>
            </div>
          </ContextMenuTrigger>

          <CanvasContextMenu addNode={addNode} />
        </ContextMenu>
      </div>

      {/* ------------------------------------------------------- */}
      {/* SETTINGS PANEL */}
      {/* ------------------------------------------------------- */}

      <aside className="border-l bg-background">
        <NodeSettingsSheet node={selectedNode} updateNode={updateNode} />
      </aside>
    </div>
  );
};
