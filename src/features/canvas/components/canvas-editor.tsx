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

import { useCallback, useEffect, useRef, useState } from "react";

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

import {
  useCreateNode,
  useDeleteNode,
  useGetNodes,
  useUpdateNode,
} from "../hooks/node.hooks";

import {
  useCreateEdge,
  useDeleteEdge,
  useGetEdges,
  useUpdateEdge,
} from "../hooks/edge.hooks";

import { dbEdgeToFlowEdge } from "../services/persistance/edge-mapper";
import { dbNodeToFlowNode } from "../services/persistance/node-mapper";

import { createFlowNode } from "../services/nodes/create-node";

import type { FlowEdge } from "./edges/types/base-edge";
import { defaultEdgeMetadata } from "./edges/default/defaults";
import { useExecutionEvents } from "../hooks/use-execution-events";
import { useTRPC } from "@/trpc/client";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { generateAutopilotWorkflow } from "@/features/autopilot/planner/planner";
import { validateAutopilotWorkflow } from "@/features/autopilot/validation/validate-workflow";
import { applyAutopilotWorkflow } from "@/features/autopilot/adapters/apply-autopilot-workflow";

type Props = {
  projectId: string;
  workflowId: string;
};

export const CanvasEditor = ({ projectId, workflowId }: Props) => {
  const trpc = useTRPC();
  /*
   * ------------------------------------------------------------
   * DATABASE DATA
   * ------------------------------------------------------------
   */

  const { data: dbNodes, isLoading: nodesLoading } = useGetNodes(workflowId);

  const { data: dbEdges, isLoading: edgesLoading } = useGetEdges(workflowId);

  const createEdgeMutation = useCreateEdge();

  const updateNodeMutation = useUpdateNode();

  const createEdge = useCreateEdge();

  const deleteEdge = useDeleteEdge();

  const updateEdge = useUpdateEdge();

  const executeWorkfow = useMutation(trpc.executions.execute.mutationOptions());

  const saveWorkflowMutation = useMutation(
    trpc.autopilot.saveWorkflow.mutationOptions(),
  );

  const nodeUpdateTimers = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  /*
   * ------------------------------------------------------------
   * REACT FLOW STATE
   * ------------------------------------------------------------
   */

  const [nodes, setNodes, reactFlowOnNodesChange] = useNodesState<AppFlowNode>(
    [],
  );

  const nodeStates = useExecutionStore((state) => state.nodeStates);
  const edgeStates = useExecutionStore((state) => state.edgeStates);

  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  const onNodesChange = useCallback(
    (changes: any[]) => {
      // Let ReactFlow update immediately
      reactFlowOnNodesChange(changes);

      for (const change of changes) {
        if (change.type !== "position") continue;

        if (!change.position) continue;

        const nodeId = change.id;

        // Clear previous timer
        if (nodeUpdateTimers.current[nodeId]) {
          clearTimeout(nodeUpdateTimers.current[nodeId]);
        }

        // Save after dragging settles
        nodeUpdateTimers.current[nodeId] = setTimeout(() => {
          updateNodeMutation.mutate({
            id: nodeId,
            position: {
              x: change.position.x,
              y: change.position.y,
            },
          });

          delete nodeUpdateTimers.current[nodeId];
        }, 400);
      }
    },
    [reactFlowOnNodesChange, updateNodeMutation],
  );

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

  const {
    setSelectedNode,
    executeAgentId,
    executeWorkflow,
    setExecuteWorkflow,
    setExecuteAgentId,
    setDeleteNode,
    executionStatus,
    setExecutionStatus,
    setRunId,
    runId,
  } = useCanvasStore();

  useExecutionEvents(runId);

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

  const updateTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const pendingNodeUpdates = useRef<Record<string, AppFlowNode>>({});

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const status = nodeStates[node.id];

        if (!status) {
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
  }, [nodeStates, setNodes]);

  const updateNode = useCallback(
    (nodeId: string, updater: (node: AppFlowNode) => AppFlowNode) => {
      setNodes((currentNodes) => {
        const nextNodes = currentNodes.map((node) => {
          if (node.id !== nodeId) {
            return node;
          }

          const updatedNode = updater(node);

          pendingNodeUpdates.current[nodeId] = updatedNode;

          return updatedNode;
        });

        return nextNodes;
      });

      const existingTimer = updateTimers.current[nodeId];

      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      updateTimers.current[nodeId] = setTimeout(() => {
        const node = pendingNodeUpdates.current[nodeId];

        if (!node) return;

        updateNodeMutation.mutate({
          id: node.id,
          config: node.data.config,
          title: node.data.title,
        });

        delete pendingNodeUpdates.current[nodeId];
        delete updateTimers.current[nodeId];
      }, 500);
    },
    [setNodes, updateNodeMutation],
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

  useEffect(() => {
    return () => {
      Object.values(updateTimers.current).forEach((timer) =>
        clearTimeout(timer),
      );
    };
  }, []);

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
            executionState: "idle",
            animated: false,
            executionCount: 0,
            disabled: false,
          },
        },
      };

      // 1. Immediately show edge
      setEdges((currentEdges) => [...currentEdges, edge]);

      // 2. Persist in background
      createEdge.mutate(
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
          onError: (error) => {
            console.error("Failed to create edge:", error);

            // 3. Rollback if DB fails
            setEdges((currentEdges) =>
              currentEdges.filter((currentEdge) => currentEdge.id !== edge.id),
            );
          },
        },
      );
    },
    [workflowId, createEdge, setEdges],
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

        // case "tool:node":
        //   updateNodeStatus(event.nodeId, "running");
        //   break;

        // case "tool:success":
        //   updateNodeStatus(event.nodeId, "success");
        //   break;

        // case "tool:error":
        //   updateNodeStatus(event.nodeId, "error");
        //   break;

        // case "edge:start":
        //   updateEdgeStatus(event.edgeId, "running");
        //   break;

        // case "edge:success":
        //   updateEdgeStatus(event.edgeId, "success");
        //   break;

        // case "edge:error":
        //   updateEdgeStatus(event.edgeId, "error");
        //   break;
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

    executeWorkfow.mutate(
      {
        workflowId,
        nodes,
        edges,
      },
      {
        onSuccess: (data) => {
          setRunId(data.runId);
        },
        onError: (error) => {
          console.error("🔥 MUTATION ERROR:", error);
        },
      },
    );

    setExecuteAgentId(null);
  }, [executeAgentId, nodes, edges, setExecuteAgentId]);

  useEffect(() => {
    if (!executeWorkflow) {
      return;
    }

    setExecutionStatus("starting");

    executeWorkfow.mutate(
      {
        workflowId,
        nodes,
        edges,
      },
      {
        onSuccess: (data) => {
          setRunId(data.runId);
          setExecutionStatus("running");
        },

        onError: (error) => {
          console.error("🔥 WORKFLOW MUTATION ERROR:", error);
          setExecutionStatus("error");
        },
      },
    );

    setExecuteWorkflow(false);
  }, [
    executeWorkflow,
    workflowId,
    nodes,
    edges,
    executeWorkfow,
    setExecuteWorkflow,
    setExecutionStatus,
  ]);

  /*
   * ------------------------------------------------------------
   * CREATE NODE
   * ------------------------------------------------------------
   */

  const createNodeMutation = useCreateNode();

  const generateWorkflow = useCallback(
    async (prompt: string) => {
      try {
        const workflow = await generateAutopilotWorkflow(prompt);

        validateAutopilotWorkflow(workflow);

        const { nodes: generatedNodes, edges: generatedEdges } =
          applyAutopilotWorkflow(workflow, setNodes, setEdges);

        saveWorkflowMutation.mutate({
          workflowId,
          name: workflow.name,
          description: workflow.description,
          nodes: generatedNodes,
          edges: generatedEdges,
        });

        console.log("[Autopilot] Generated workflow:", workflow);
        console.log("[Autopilot] Flow nodes:", generatedNodes);
        console.log("[Autopilot] Flow edges:", generatedEdges);

        return workflow;
      } catch (error) {
        console.error("[Autopilot] Failed to generate workflow:", error);

        throw error;
      }
    },
    [workflowId, setNodes, setEdges, saveWorkflowMutation],
  );

  const addNode = useCallback(
    (type: AppFlowNode["type"], position: { x: number; y: number }) => {
      const node = createFlowNode(type, position);

      // Immediately show it
      setNodes((current) => [...current, node]);

      createNodeMutation.mutate(
        {
          workflowId,
          node,
        },
        {
          onError: (error) => {
            console.error("Failed to create node:", error);

            // Roll back if DB creation fails
            setNodes((current) => current.filter((n) => n.id !== node.id));
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
      // Optimistically remove node
      setNodes((currentNodes) =>
        currentNodes.filter((node) => node.id !== nodeId),
      );

      // Optimistically remove connected edges
      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
      );

      // Persist deletion
      deleteNodeMutation.mutate(
        {
          id: nodeId,
        },
        {
          onSuccess: () => {
            setSelectedNode(null);
          },

          onError: (error) => {
            console.error("Failed to delete node:", error);

            // IMPORTANT:
            // We removed the node/edges optimistically.
            // If you want full rollback support, we'll restore
            // the previous state here.
          },
        },
      );
    },
    [deleteNodeMutation, setNodes, setEdges, setSelectedNode],
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
  useEffect(() => {
    return () => {
      Object.values(nodeUpdateTimers.current).forEach((timer) =>
        clearTimeout(timer),
      );
    };
  }, []);

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
                onNodesDelete={(deletedNodes) => {
                  deletedNodes.forEach((node) => {
                    removeNode(node.id);
                  });
                }}
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
                  <button
                    onClick={() =>
                      generateWorkflow(
                        "Build a SaaS expense tracker with Google authentication, PostgreSQL, Stripe, and an AI assistant",
                      )
                    }
                  >
                    Test Autopilot
                  </button>
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
        <NodeSettingsSheet
          projectId={projectId}
          workflowId={workflowId}
          node={selectedNode}
          updateNode={updateNode}
        />
      </aside>
    </div>
  );
};
