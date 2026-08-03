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
import { AgentFlowNode, NodeStatusType } from "./nodes/types";
import { executionEvents } from "../services/execution/execution-events";
import { EdgeExecutionState } from "./edges/types/edge-status";
import { ExecutionLog, useExecutionStore } from "../store/execution-store";
import { ExecutionPanel } from "../services/execution/execution-panel";
import { ArrowRight, CheckCircle2, PlayIcon, WrenchIcon, XCircle } from "lucide-react";

type Props = {
  projectId: string;
  workflowId: string;
};

export const CanvasEditor = ({ projectId, workflowId }: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { setSelectedNode, executeAgentId, setExecuteAgentId } =
    useCanvasStore();

  const updateEdgeStatus = (edgeId: string, status: EdgeExecutionState) => {
    console.log(edgeId, status);
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id !== edgeId) return edge;

        const data = edge.data!;

        return {
          ...edge,
          animated: status === "running",
          data: {
            ...data,
            metadata: {
              ...data.metadata,
              executionState: status,
              animated: status === "running",
            },
          },
        };
      }),
    );
  };

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
                executionState: "idle",
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

  const updateNodeStatus = (nodeId: string, status: NodeStatusType) => {
    // @ts-ignore
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                metadata: {
                  ...node.data.metadata,
                  status,
                },
              },
            }
          : node,
      ),
    );
  };
  const { addLog } = useExecutionStore();

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
          console.log("EDGE START", event.edgeId);
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
  }, []);

  useEffect(() => {
    if (!executeAgentId) return;

    const agent = nodes.find(
      (node): node is AgentFlowNode =>
        node.id === executeAgentId && node.type === "agent",
    );

    if (!agent) return;

    executeAgent(agent, nodes, edges);

    setExecuteAgentId(null);
  }, [executeAgentId, nodes, edges, setExecuteAgentId]);

  

  return (
    <div className="flex h-full w-full">
      {/* Canvas */}
      <div className="flex-1">
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

      {/* Execution Panel */}
      <aside className="w-80 border-l bg-background">
        <ExecutionPanel />
      </aside>
    </div>
  );
};
