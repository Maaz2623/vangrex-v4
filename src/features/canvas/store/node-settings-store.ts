import { create } from "zustand";

interface NodeSettingsStore {
  selectedNodeId: string | null;
  open: (nodeId: string) => void;

  close: () => void;
}

export const useNodeSettingsStore = create<NodeSettingsStore>((set) => ({
  selectedNodeId: null,
  open: (nodeId) =>
    set({
      selectedNodeId: nodeId,
    }),
  close: () =>
    set({
      selectedNodeId: null,
    }),
}));
