import { create } from "zustand";

import { ExecutionEvent } from "../services/execution/event-types";
import { ExecutionOutput } from "../services/execution/execution-output";

export interface ExecutionLog {
  id: string;
  timestamp: number;
  event: ExecutionEvent;
}

interface ExecutionStore {
  logs: ExecutionLog[];

  outputs: Record<string, ExecutionOutput>;

  addLog: (event: ExecutionEvent) => void;

  setOutput: (nodeId: string, output: ExecutionOutput) => void;

  clearLogs: () => void;

  clearOutputs: () => void;

  clear: () => void;
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  logs: [],

  outputs: {},

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

  setOutput: (nodeId, output) =>
    set((state) => ({
      outputs: {
        ...state.outputs,
        [nodeId]: output,
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

  clear: () =>
    set({
      logs: [],
      outputs: {},
    }),
}));
