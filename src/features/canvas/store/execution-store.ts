import { create } from "zustand";

import { ExecutionEvent } from "../services/execution/event-types";
import { ExecutionOutput } from "../services/execution/execution-output";
import { NodeStatusType } from "../components/nodes/types";

export interface ExecutionLog {
  id: string;
  timestamp: number;
  event: ExecutionEvent;
}

interface ExecutionStore {
  logs: ExecutionLog[];

  outputs: Record<string, ExecutionOutput>;

  nodeStates: Record<string, NodeStatusType>;

  edgeStates: Record<string, NodeStatusType>;

  addLog: (event: ExecutionEvent) => void;

  addEvent: (event: ExecutionEvent) => void;

  setOutput: (nodeId: string, output: ExecutionOutput) => void;

  setNodeStatus: (nodeId: string, status: NodeStatusType) => void;

  setEdgeStatus: (edgeId: string, status: NodeStatusType) => void;

  clearLogs: () => void;

  clearOutputs: () => void;

  clearExecutionState: () => void;

  clear: () => void;
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  logs: [],

  outputs: {},

  nodeStates: {},

  edgeStates: {},

  addLog: (event) =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          event,
        },
      ],
    })),

  addEvent: (event) =>
    set((state) => {
      const log: ExecutionLog = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        event,
      };

      const nextNodeStates = { ...state.nodeStates };
      const nextEdgeStates = { ...state.edgeStates };

      switch (event.type) {
        case "node:start":
          nextNodeStates[event.nodeId] = "running";
          break;

        case "node:success":
          nextNodeStates[event.nodeId] = "success";
          break;

        case "node:error":
          nextNodeStates[event.nodeId] = "error";
          break;

        case "edge:start":
          nextEdgeStates[event.edgeId] = "running";
          break;

        case "edge:success":
          nextEdgeStates[event.edgeId] = "success";
          break;

        case "edge:error":
          nextEdgeStates[event.edgeId] = "error";
          break;
      }

      return {
        logs: [...state.logs, log],
        nodeStates: nextNodeStates,
        edgeStates: nextEdgeStates,
      };
    }),

  setOutput: (nodeId, output) =>
    set((state) => ({
      outputs: {
        ...state.outputs,
        [nodeId]: output,
      },
    })),

  setNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodeStates: {
        ...state.nodeStates,
        [nodeId]: status,
      },
    })),

  setEdgeStatus: (edgeId, status) =>
    set((state) => ({
      edgeStates: {
        ...state.edgeStates,
        [edgeId]: status,
      },
    })),

  clearLogs: () =>
    set({
      logs: [],
    }),

  clearOutputs: () =>
    set({
      outputs: {},
    }),

  clearExecutionState: () =>
    set({
      nodeStates: {},
      edgeStates: {},
    }),

  clear: () =>
    set({
      logs: [],
      outputs: {},
      nodeStates: {},
      edgeStates: {},
    }),
}));