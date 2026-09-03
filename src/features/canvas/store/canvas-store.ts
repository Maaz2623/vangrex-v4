import { create } from "zustand";

type WorkflowExecutionStatus =
  | "idle"
  | "starting"
  | "running"
  | "success"
  | "error";

interface CanvasStore {
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
  executeAgentId: string | null;
  setExecuteAgentId: (id: string | null) => void;
  executeWorkflow: boolean;
  setExecuteWorkflow: (value: boolean) => void;
  executionStatus: WorkflowExecutionStatus;
  setExecutionStatus: (status: WorkflowExecutionStatus) => void;
  deleteNode: (nodeId: string) => void;
  setDeleteNode: (handler: (nodeId: string) => void) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  selectedNodeId: null,

  setSelectedNode: (id) =>
    set({
      selectedNodeId: id,
    }),

  // Execution

  executeWorkflow: false,

  setExecuteWorkflow: (value) =>
    set({
      executeWorkflow: value,
    }),

  executionStatus: "idle",

  setExecutionStatus: (status) =>
    set({
      executionStatus: status,
    }),

  executeAgentId: null,
  setExecuteAgentId: (id) =>
    set({
      executeAgentId: id,
    }),

  deleteNode: () => {},

  setDeleteNode: (handler) =>
    set({
      deleteNode: handler,
    }),
}));
