import { create } from "zustand";

interface CanvasStore {
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  selectedNodeId: null,
  setSelectedNode: (id) =>
    set({
      selectedNodeId: id,
    }),
}));
