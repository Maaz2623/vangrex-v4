import { create } from "zustand";

interface CanvasStore {
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
  executeAgentId: string | null;
  setExecuteAgentId: (id: string | null) => void;
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
