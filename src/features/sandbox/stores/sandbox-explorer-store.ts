import { create } from "zustand";

export interface SandboxFile {
  name: string;
  type: "file" | "directory";
  path: string;
  size: number;
  modifiedTime: Date;
}

interface SandboxExplorerState {
  sandboxId: string | null;

  currentPath: string;

  files: SandboxFile[];

  selectedFile: string | null;

  openFiles: string[];

  fileContents: Record<string, string>;

  isLoadingFiles: boolean;

  isLoadingFile: boolean;

  error: string | null;

  setSandboxId: (sandboxId: string | null) => void;

  setCurrentPath: (path: string) => void;

  setFiles: (files: SandboxFile[]) => void;

  setSelectedFile: (path: string | null) => void;

  openFile: (path: string) => void;

  closeFile: (path: string) => void;

  setFileContent: (path: string, content: string) => void;

  setLoadingFiles: (loading: boolean) => void;

  setLoadingFile: (loading: boolean) => void;

  setError: (error: string | null) => void;

  reset: () => void;
}

const initialState = {
  sandboxId: null,
  currentPath: "/",
  files: [],
  selectedFile: null,
  openFiles: [],
  fileContents: {},
  isLoadingFiles: false,
  isLoadingFile: false,
  error: null,
};

export const useSandboxExplorerStore = create<SandboxExplorerState>((set) => ({
  ...initialState,

  setSandboxId: (sandboxId) =>
    set({
      sandboxId,
      currentPath: "/home/user",
      files: [],
      selectedFile: null,
      openFiles: [],
      fileContents: {},
      error: null,
    }),

  setCurrentPath: (currentPath) =>
    set({
      currentPath,
      selectedFile: null,
    }),

  setFiles: (files) =>
    set({
      files,
    }),

  setSelectedFile: (selectedFile) =>
    set({
      selectedFile,
    }),

  openFile: (path) =>
    set((state) => ({
      selectedFile: path,
      openFiles: state.openFiles.includes(path)
        ? state.openFiles
        : [...state.openFiles, path],
    })),

  closeFile: (path) =>
    set((state) => {
      const openFiles = state.openFiles.filter((filePath) => filePath !== path);

      return {
        openFiles,
        selectedFile:
          state.selectedFile === path
            ? (openFiles.at(-1) ?? null)
            : state.selectedFile,
      };
    }),

  setFileContent: (path, content) =>
    set((state) => ({
      fileContents: {
        ...state.fileContents,
        [path]: content,
      },
    })),

  setLoadingFiles: (isLoadingFiles) =>
    set({
      isLoadingFiles,
    }),

  setLoadingFile: (isLoadingFile) =>
    set({
      isLoadingFile,
    }),

  setError: (error) =>
    set({
      error,
    }),

  reset: () =>
    set({
      ...initialState,
    }),
}));
