"use client";

import { useEffect, useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ChevronLeft,
  ChevronRight,
  File,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  FilePlus,
  Loader2,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { useSandboxExplorerStore } from "../stores/sandbox-explorer-store";
import { FileIcon } from "./file-icon";

interface SandboxFileExplorerProps {
  sandboxId: string;
}

type DialogMode = "file" | "folder" | "rename" | "delete" | null;

export function SandboxFileExplorer({ sandboxId }: SandboxFileExplorerProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const {
    currentPath,
    selectedFile,
    setSandboxId,
    setCurrentPath,
    openFile,
    setSelectedFile,
  } = useSandboxExplorerStore();

  /*
   * Navigation history
   */
  const [history, setHistory] = useState<string[]>(["/"]);

  const [historyIndex, setHistoryIndex] = useState(0);

  /*
   * Dialog state
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);

  const [dialogValue, setDialogValue] = useState("");

  /*
   * Used for rename/delete.
   */
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const [targetName, setTargetName] = useState<string | null>(null);

  /*
   * Header menu.
   */
  const [showMenu, setShowMenu] = useState(false);

  /*
   * Files
   */
  const {
    data: files = [],
    isLoading,
    error,
    refetch,
  } = useQuery(
    trpc.sandbox.list.queryOptions({
      sandboxId,
      path: currentPath,
    }),
  );

  /*
   * Create file
   */
  const createFileMutation = useMutation(
    trpc.sandbox.write.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.sandbox.list.queryKey({
            sandboxId,
            path: currentPath,
          }),
        });
      },
    }),
  );

  /*
   * Create folder
   */
  const createFolderMutation = useMutation(
    trpc.sandbox.createDirectory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.sandbox.list.queryKey({
            sandboxId,
            path: currentPath,
          }),
        });
      },
    }),
  );

  /*
   * Rename
   */
  const renameMutation = useMutation(
    trpc.sandbox.rename.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.sandbox.list.queryKey({
            sandboxId,
            path: currentPath,
          }),
        });
      },
    }),
  );

  /*
   * Delete
   */
  const deleteMutation = useMutation(
    trpc.sandbox.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.sandbox.list.queryKey({
            sandboxId,
            path: currentPath,
          }),
        });
      },
    }),
  );

  /*
   * Keep explorer connected to current sandbox.
   */
  useEffect(() => {
    setSandboxId(sandboxId);
  }, [sandboxId, setSandboxId]);

  /*
   * Sort directories before files.
   */
  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "dir" ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
  }, [files]);

  /*
   * Navigate to a directory.
   */
  const navigateTo = (path: string) => {
    if (path === currentPath) {
      return;
    }

    const nextHistory = history.slice(0, historyIndex + 1);

    nextHistory.push(path);

    setHistory(nextHistory);

    setHistoryIndex(nextHistory.length - 1);

    setCurrentPath(path);
  };

  /*
   * Back.
   */
  const goBack = () => {
    if (historyIndex <= 0) {
      return;
    }

    const nextIndex = historyIndex - 1;

    setHistoryIndex(nextIndex);
    setCurrentPath(history[nextIndex]);
  };

  /*
   * Forward.
   */
  const goForward = () => {
    if (historyIndex >= history.length - 1) {
      return;
    }

    const nextIndex = historyIndex + 1;

    setHistoryIndex(nextIndex);
    setCurrentPath(history[nextIndex]);
  };

  /*
   * Parent directory.
   */
  const goUp = () => {
    if (currentPath === "/") {
      return;
    }

    const parts = currentPath.split("/").filter(Boolean);

    parts.pop();

    const parent = parts.length > 0 ? `/${parts.join("/")}` : "/";

    navigateTo(parent);
  };

  /*
   * File click.
   */
  const handleFileClick = (path: string) => {
    openFile(path);
  };

  /*
   * Directory click.
   */
  const handleDirectoryClick = (path: string) => {
    navigateTo(path);
  };

  /*
   * Open new file dialog.
   */
  const openCreateFileDialog = () => {
    setDialogMode("file");
    setDialogValue("");
    setTargetPath(null);
    setTargetName(null);
    setDialogOpen(true);
    setShowMenu(false);
  };

  /*
   * Open new folder dialog.
   */
  const openCreateFolderDialog = () => {
    setDialogMode("folder");
    setDialogValue("");
    setTargetPath(null);
    setTargetName(null);
    setDialogOpen(true);
    setShowMenu(false);
  };

  /*
   * Open rename dialog.
   */
  const openRenameDialog = (path: string, name: string) => {
    setDialogMode("rename");
    setDialogValue(name);
    setTargetPath(path);
    setTargetName(name);
    setDialogOpen(true);
  };

  /*
   * Open delete dialog.
   */
  const openDeleteDialog = (path: string, name: string) => {
    setDialogMode("delete");
    setDialogValue("");
    setTargetPath(path);
    setTargetName(name);
    setDialogOpen(true);
  };

  /*
   * Close dialog and reset state.
   */
  const closeDialog = () => {
    setDialogOpen(false);
    setDialogMode(null);
    setDialogValue("");
    setTargetPath(null);
    setTargetName(null);
  };

  /*
   * Submit dialog.
   */
  const handleDialogSubmit = async () => {
    const value = dialogValue.trim();

    /*
     * New file
     */
    if (dialogMode === "file") {
      if (!value) {
        return;
      }

      const path =
        currentPath === "/" ? `/${value}` : `${currentPath}/${value}`;

      await createFileMutation.mutateAsync({
        sandboxId,
        path,
        content: "",
      });

      openFile(path);

      closeDialog();

      return;
    }

    /*
     * New folder
     */
    if (dialogMode === "folder") {
      if (!value) {
        return;
      }

      const path =
        currentPath === "/" ? `/${value}` : `${currentPath}/${value}`;

      await createFolderMutation.mutateAsync({
        sandboxId,
        path,
      });

      closeDialog();

      return;
    }

    /*
     * Rename
     */
    if (dialogMode === "rename" && targetPath) {
      if (!value) {
        return;
      }

      const parent =
        targetPath.substring(0, targetPath.lastIndexOf("/")) || "/";

      const newPath = parent === "/" ? `/${value}` : `${parent}/${value}`;

      await renameMutation.mutateAsync({
        sandboxId,
        oldPath: targetPath,
        newPath,
      });

      /*
       * Keep currently opened file selected.
       */
      if (selectedFile === targetPath) {
        setSelectedFile(newPath);
      }

      closeDialog();

      return;
    }

    /*
     * Delete
     */
    if (dialogMode === "delete" && targetPath) {
      await deleteMutation.mutateAsync({
        sandboxId,
        path: targetPath,
      });

      if (selectedFile === targetPath) {
        setSelectedFile(null);
      }

      closeDialog();
    }
  };

  /*
   * Enter key handling.
   */
  const handleDialogKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    handleDialogSubmit();
  };

  /*
   * Breadcrumbs.
   */
  const breadcrumbs = currentPath.split("/").filter(Boolean);

  const isMutating =
    createFileMutation.isPending ||
    createFolderMutation.isPending ||
    renameMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="flex h-full min-h-0 w-64 shrink-0 flex-col border-r bg-background">
      {/* ------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------ */}

      <div className="flex h-10 shrink-0 items-center justify-between border-b px-2">
        <span className="px-1 text-xs font-medium">Explorer</span>

        <div className="flex items-center gap-0.5">
          {/* New file */}
          <button
            type="button"
            onClick={openCreateFileDialog}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="New file"
          >
            <FilePlus className="size-3.5" />
          </button>

          {/* New folder */}
          <button
            type="button"
            onClick={openCreateFolderDialog}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="New folder"
          >
            <FolderPlus className="size-3.5" />
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>

          {/* More */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((value) => !value)}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="More"
            >
              <MoreHorizontal className="size-3.5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 z-50 w-40 rounded-md border bg-popover p-1 shadow-lg">
                <button
                  type="button"
                  onClick={openCreateFileDialog}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted"
                >
                  <FilePlus className="size-3.5" />
                  New file
                </button>

                <button
                  type="button"
                  onClick={openCreateFolderDialog}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted"
                >
                  <FolderPlus className="size-3.5" />
                  New folder
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    refetch();
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted"
                >
                  <RefreshCw className="size-3.5" />
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* NAVIGATION */}
      {/* ------------------------------------------------ */}

      <div className="flex h-8 shrink-0 items-center gap-0.5 border-b px-1">
        <button
          type="button"
          onClick={goBack}
          disabled={historyIndex === 0}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          title="Back"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          title="Forward"
        >
          <ChevronRight className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={goUp}
          disabled={currentPath === "/"}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          title="Parent directory"
        >
          <ChevronRight className="size-3.5 rotate-[-90deg]" />
        </button>
      </div>

      {/* ------------------------------------------------ */}
      {/* BREADCRUMB */}
      {/* ------------------------------------------------ */}

      <div className="flex h-8 shrink-0 items-center gap-1 overflow-x-auto border-b px-2">
        <button
          type="button"
          onClick={() => navigateTo("/")}
          className={`shrink-0 text-[11px] ${
            currentPath === "/"
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          /
        </button>

        {breadcrumbs.map((part, index) => {
          const path = "/" + breadcrumbs.slice(0, index + 1).join("/");

          return (
            <div key={path} className="flex shrink-0 items-center gap-1">
              <ChevronRight className="size-3 text-muted-foreground/40" />

              <button
                type="button"
                onClick={() => navigateTo(path)}
                className={`max-w-24 truncate text-[11px] ${
                  path === currentPath
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {part}
              </button>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------ */}
      {/* FILE TREE */}
      {/* ------------------------------------------------ */}

      <div className="min-h-0 flex-1 overflow-y-auto p-1">
        {isLoading ? (
          <div className="flex items-center gap-2 px-3 py-4 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Loading files...
          </div>
        ) : error ? (
          <div className="px-3 py-4 text-xs text-destructive">
            {error.message}
          </div>
        ) : sortedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-3 py-12 text-center">
            <Folder className="mb-2 size-7 text-muted-foreground/30" />

            <p className="text-xs text-muted-foreground">Empty directory</p>

            <button
              type="button"
              onClick={openCreateFileDialog}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Create a file
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {sortedFiles.map((file) => {
              const isDirectory = file.type === "dir";

              const isSelected = selectedFile === file.path;

              return (
                <div
                  key={file.path}
                  className={`group flex min-w-0 items-center rounded-md transition-colors ${
                    isSelected ? "bg-muted" : "hover:bg-muted/60"
                  }`}
                >
                  {/* File/folder */}
                  <button
                    type="button"
                    onClick={() =>
                      isDirectory
                        ? handleDirectoryClick(file.path)
                        : handleFileClick(file.path)
                    }
                    className="flex min-w-0 flex-1 items-center gap-1.5 px-2 py-1.5 text-left"
                  >
                    <FileIcon
                      name={file.name}
                      isDirectory={isDirectory}
                      open={isDirectory && currentPath === file.path}
                    />

                    <span className="min-w-0 truncate text-xs">
                      {file.name}
                    </span>
                  </button>

                  {/* Actions */}
                  <div className="hidden shrink-0 items-center gap-0.5 pr-1 group-hover:flex">
                    <button
                      type="button"
                      onClick={() => openRenameDialog(file.path, file.name)}
                      className="rounded p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                      title="Rename"
                    >
                      <Pencil className="size-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteDialog(file.path, file.name)}
                      className="rounded p-1 text-muted-foreground hover:bg-background hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* DIALOGS */}
      {/* ------------------------------------------------ */}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {/* NEW FILE */}
          {dialogMode === "file" && (
            <>
              <DialogHeader>
                <DialogTitle>New file</DialogTitle>

                <DialogDescription>
                  Create a new file in{" "}
                  <span className="font-mono text-xs">{currentPath}</span>
                </DialogDescription>
              </DialogHeader>

              <Input
                autoFocus
                value={dialogValue}
                onChange={(event) => setDialogValue(event.target.value)}
                onKeyDown={handleDialogKeyDown}
                placeholder="example.ts"
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleDialogSubmit}
                  disabled={!dialogValue.trim() || isMutating}
                >
                  {createFileMutation.isPending && (
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                  )}
                  Create file
                </Button>
              </DialogFooter>
            </>
          )}

          {/* NEW FOLDER */}
          {dialogMode === "folder" && (
            <>
              <DialogHeader>
                <DialogTitle>New folder</DialogTitle>

                <DialogDescription>
                  Create a new folder in{" "}
                  <span className="font-mono text-xs">{currentPath}</span>
                </DialogDescription>
              </DialogHeader>

              <Input
                autoFocus
                value={dialogValue}
                onChange={(event) => setDialogValue(event.target.value)}
                onKeyDown={handleDialogKeyDown}
                placeholder="components"
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleDialogSubmit}
                  disabled={!dialogValue.trim() || isMutating}
                >
                  {createFolderMutation.isPending && (
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                  )}
                  Create folder
                </Button>
              </DialogFooter>
            </>
          )}

          {/* RENAME */}
          {dialogMode === "rename" && (
            <>
              <DialogHeader>
                <DialogTitle>Rename</DialogTitle>

                <DialogDescription>
                  Rename <span className="font-mono text-xs">{targetName}</span>
                </DialogDescription>
              </DialogHeader>

              <Input
                autoFocus
                value={dialogValue}
                onChange={(event) => setDialogValue(event.target.value)}
                onKeyDown={handleDialogKeyDown}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={handleDialogSubmit}
                  disabled={!dialogValue.trim() || isMutating}
                >
                  {renameMutation.isPending && (
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                  )}
                  Rename
                </Button>
              </DialogFooter>
            </>
          )}

          {/* DELETE */}
          {dialogMode === "delete" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Delete <span className="font-mono">{targetName}</span>?
                </DialogTitle>

                <DialogDescription>
                  This action cannot be undone. The file or folder will be
                  permanently removed from the sandbox.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDialogSubmit}
                  disabled={isMutating}
                >
                  {deleteMutation.isPending && (
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                  )}
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
