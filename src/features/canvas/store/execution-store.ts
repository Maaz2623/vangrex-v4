import { create } from "zustand";
import { ExecutionEvent } from "../services/execution/event-types";

export interface ExecutionLog {
  id: string;

  timestamp: number;

  event: ExecutionEvent;
}

interface ExecutionStore {
  logs: ExecutionLog[];

  addLog: (event: ExecutionEvent) => void;

  clearLogs: () => void;
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  logs: [],

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

  clearLogs: () =>
    set({
      logs: [],
    }),
}));
