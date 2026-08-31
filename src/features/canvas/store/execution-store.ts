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

      const nodeStates = { ...state.nodeStates };
      const edgeStates = { ...state.edgeStates };

      const outputs = { ...state.outputs };

      switch (event.type) {
        case "node:start":
          nodeStates[event.nodeId] = "running";
          break;

        case "node:success":
          nodeStates[event.nodeId] = "success";

          if (event.output) {
            outputs[event.nodeId] = event.output;
          }
          break;

        case "node:error":
          nodeStates[event.nodeId] = "error";
          break;

        // case "edge:start":
        //   edgeStates[event.edgeId] = "running";
        //   break;

        // case "edge:success":
        //   edgeStates[event.edgeId] = "success";
        //   break;

        // case "edge:error":
        //   edgeStates[event.edgeId] = "error";
        //   break;
      }

      return {
        logs: [...state.logs, log],
        nodeStates,
        edgeStates,
        outputs,
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
