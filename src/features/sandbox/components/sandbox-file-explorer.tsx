"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FilePlus,
  Folder,
  FolderPlus,
  Loader2,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

  // ---------------------------------------------------------------------------
  // File inputs
  // ---------------------------------------------------------------------------

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------------
  // Navigation history
  // ---------------------------------------------------------------------------

  const [history, setHistory] = useState<string[]>(["/"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // ---------------------------------------------------------------------------
  // Dialog state
  // ---------------------------------------------------------------------------

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [dialogValue, setDialogValue] = useState("");

  // ---------------------------------------------------------------------------
  // Rename / delete target
  // ---------------------------------------------------------------------------

  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Header menu
  // ---------------------------------------------------------------------------

  const [showMenu, setShowMenu] = useState(false);

  // ---------------------------------------------------------------------------
  // Files
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Create file
  // ---------------------------------------------------------------------------

  const createFileMutation = useMutation(
    trpc.sandbox.write.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.sandbox.list.queryKey({
            sandboxId,
            path: currentPath,
          }),
        });
      },
    }),
  );

  // ---------------------------------------------------------------------------
  // Upload single file
  // ---------------------------------------------------------------------------

  const uploadFileMutation = useMutation(
    trpc.sandbox.uploadFile.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.sandbox.list.queryKey({
            sandboxId,
            path: currentPath,
          }),
        });
      },
    }),
  );

  // ---------------------------------------------------------------------------
  // Upload ZIP
  // ---------------------------------------------------------------------------

  const uploadZipMutation = useMutation(
    trpc.sandbox.uploadZip.mutationOptions(),
  );

  // ---------------------------------------------------------------------------
  // Create folder
  // ---------------------------------------------------------------------------

  const createFolderMutation = useMutation(
    trpc.sandbox.createDirectory.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.sandbox.list.queryKey({
            sandboxId,
            path: currentPath,
          }),
        });
      },
    }),
  );

  // ---------------------------------------------------------------------------
  // Rename
  // ---------------------------------------------------------------------------

  const renameMutation = useMutation(
    trpc.sandbox.rename.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.sandbox.list.queryKey({
            sandboxId,
            path: currentPath,
          }),
        });
      },
    }),
  );

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  const deleteMutation = useMutation(
    trpc.sandbox.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.sandbox.list.queryKey({
            sandboxId,
            path: currentPath,
          }),
        });
      },
    }),
  );

  // ---------------------------------------------------------------------------
  // Keep explorer connected to current sandbox
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setSandboxId(sandboxId);
  }, [sandboxId, setSandboxId]);

  // ---------------------------------------------------------------------------
  // Sort directories before files
  // ---------------------------------------------------------------------------

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "dir" ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
  }, [files]);

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

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

  const goBack = () => {
    if (historyIndex <= 0) {
      return;
    }

    const nextIndex = historyIndex - 1;

    setHistoryIndex(nextIndex);
    setCurrentPath(history[nextIndex]);
  };

  const goForward = () => {
    if (historyIndex >= history.length - 1) {
      return;
    }

    const nextIndex = historyIndex + 1;

    setHistoryIndex(nextIndex);
    setCurrentPath(history[nextIndex]);
  };

  const goUp = () => {
    if (currentPath === "/") {
      return;
    }

    const parts = currentPath.split("/").filter(Boolean);

    parts.pop();

    const parent = parts.length > 0 ? `/${parts.join("/")}` : "/";

    navigateTo(parent);
  };

  // ---------------------------------------------------------------------------
  // File interactions
  // ---------------------------------------------------------------------------

  const handleFileClick = (path: string) => {
    openFile(path);
  };

  const handleDirectoryClick = (path: string) => {
    navigateTo(path);
  };

  // ---------------------------------------------------------------------------
  // Dialog helpers
  // ---------------------------------------------------------------------------

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogMode(null);
    setDialogValue("");
    setTargetPath(null);
    setTargetName(null);
  };

  const openCreateFileDialog = () => {
    setDialogMode("file");
    setDialogValue("");
    setTargetPath(null);
    setTargetName(null);
    setDialogOpen(true);
    setShowMenu(false);
  };

  const openCreateFolderDialog = () => {
    setDialogMode("folder");
    setDialogValue("");
    setTargetPath(null);
    setTargetName(null);
    setDialogOpen(true);
    setShowMenu(false);
  };

  const openRenameDialog = (path: string, name: string) => {
    setDialogMode("rename");
    setDialogValue(name);
    setTargetPath(path);
    setTargetName(name);
    setDialogOpen(true);
  };

  const openDeleteDialog = (path: string, name: string) => {
    setDialogMode("delete");
    setDialogValue("");
    setTargetPath(path);
    setTargetName(name);
    setDialogOpen(true);
  };

  // ---------------------------------------------------------------------------
  // Convert File -> base64
  // ---------------------------------------------------------------------------

  const fileToBase64 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let binary = "";

    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary);
  };

  // ---------------------------------------------------------------------------
  // Create file
  // ---------------------------------------------------------------------------

  const handleCreateFile = async () => {
    const value = dialogValue.trim();

    if (!value) {
      return;
    }

    const path = currentPath === "/" ? `/${value}` : `${currentPath}/${value}`;

    await createFileMutation.mutateAsync({
      sandboxId,
      path,
      content: "",
    });

    openFile(path);
    resetDialog();
  };

  // ---------------------------------------------------------------------------
  // Create folder
  // ---------------------------------------------------------------------------

  const handleCreateFolder = async () => {
    const value = dialogValue.trim();

    if (!value) {
      return;
    }

    const path = currentPath === "/" ? `/${value}` : `${currentPath}/${value}`;

    await createFolderMutation.mutateAsync({
      sandboxId,
      path,
    });

    resetDialog();
  };

  // ---------------------------------------------------------------------------
  // Rename
  // ---------------------------------------------------------------------------

  const handleRename = async () => {
    const value = dialogValue.trim();

    if (!value || !targetPath) {
      return;
    }

    const parent = targetPath.substring(0, targetPath.lastIndexOf("/")) || "/";

    const newPath = parent === "/" ? `/${value}` : `${parent}/${value}`;

    await renameMutation.mutateAsync({
      sandboxId,
      oldPath: targetPath,
      newPath,
    });

    if (selectedFile === targetPath) {
      setSelectedFile(newPath);
    }

    resetDialog();
  };

  // ---------------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------------

  const handleDelete = async () => {
    if (!targetPath) {
      return;
    }

    await deleteMutation.mutateAsync({
      sandboxId,
      path: targetPath,
    });

    if (selectedFile === targetPath) {
      setSelectedFile(null);
    }

    resetDialog();
  };

  // ---------------------------------------------------------------------------
  // Dialog submit
  // ---------------------------------------------------------------------------

  const handleDialogSubmit = async () => {
    if (dialogMode === "file") {
      await handleCreateFile();
      return;
    }

    if (dialogMode === "folder") {
      await handleCreateFolder();
      return;
    }

    if (dialogMode === "rename") {
      await handleRename();
      return;
    }

    if (dialogMode === "delete") {
      await handleDelete();
    }
  };

  // ---------------------------------------------------------------------------
  // Enter key
  // ---------------------------------------------------------------------------

  const handleDialogKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    void handleDialogSubmit();
  };

  // ---------------------------------------------------------------------------
  // Single file upload
  // ---------------------------------------------------------------------------

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetDialog();

    const toastId = `sandbox-upload-${Date.now()}`;

    try {
      toast.loading(`Uploading ${file.name}`, {
        id: toastId,
        description: "Preparing file...",
      });

      const content = await fileToBase64(file);

      const targetPath =
        currentPath === "/" ? `/${file.name}` : `${currentPath}/${file.name}`;

      toast.loading(`Uploading ${file.name}`, {
        id: toastId,
        description: "Uploading file...",
      });

      await uploadFileMutation.mutateAsync({
        sandboxId,
        path: targetPath,
        content,
      });

      toast.success("Upload complete", {
        id: toastId,
        description: file.name,
      });

      openFile(targetPath);
    } catch (error) {
      console.error("[sandbox] upload failed:", error);

      toast.error("Upload failed", {
        id: toastId,
        description:
          error instanceof Error
            ? error.message
            : `Failed to upload ${file.name}`,
      });
    } finally {
      event.target.value = "";
    }
  };

  // ---------------------------------------------------------------------------
  // Folder upload
  //
  // NEW:
  // Folder -> ZIP -> base64 -> ONE tRPC request -> E2B -> unzip
  // ---------------------------------------------------------------------------

  const handleFolderUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      event.target.value = "";
      return;
    }

    // Capture the destination before closing the picker.
    const uploadBasePath = currentPath;

    // Close the dialog immediately.
    resetDialog();

    const toastId = `sandbox-folder-upload-${Date.now()}`;

    try {
      // -----------------------------------------------------------------------
      // 1. Prepare ZIP
      // -----------------------------------------------------------------------

      toast.loading("Preparing folder", {
        id: toastId,
        description: `Adding ${files.length} files to ZIP...`,
      });

      const zip = new JSZip();

      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        const relativePath = file.webkitRelativePath;

        if (!relativePath) {
          continue;
        }

        // Preserve the complete folder structure.
        zip.file(relativePath, file);

        const percent = Math.round(((index + 1) / files.length) * 100);

        toast.loading("Preparing folder", {
          id: toastId,
          description: `${percent}% · Adding ${relativePath}`,
        });
      }

      // -----------------------------------------------------------------------
      // 2. Generate ZIP
      // -----------------------------------------------------------------------

      toast.loading("Preparing folder", {
        id: toastId,
        description: "Compressing folder...",
      });

      const zipBlob = await zip.generateAsync(
        {
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 6,
          },
        },
        (metadata) => {
          const percent = Math.round(metadata.percent);

          toast.loading("Preparing folder", {
            id: toastId,
            description: `${percent}% · Compressing folder`,
          });
        },
      );

      // -----------------------------------------------------------------------
      // 3. Convert ZIP -> Base64
      //
      // This happens ONCE instead of once per file.
      // -----------------------------------------------------------------------

      toast.loading("Uploading folder", {
        id: toastId,
        description: `Uploading ${(zipBlob.size / 1024).toFixed(
          1,
        )} KB archive...`,
      });

      const zipArrayBuffer = await zipBlob.arrayBuffer();

      const bytes = new Uint8Array(zipArrayBuffer);

      let binary = "";

      const chunkSize = 0x8000;

      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(
          ...bytes.subarray(i, Math.min(i + chunkSize, bytes.length)),
        );
      }

      const base64 = btoa(binary);

      // -----------------------------------------------------------------------
      // 4. ONE tRPC request
      // -----------------------------------------------------------------------

      await uploadZipMutation.mutateAsync({
        sandboxId,
        path: uploadBasePath,
        base64,
      });

      // -----------------------------------------------------------------------
      // 5. Done
      // -----------------------------------------------------------------------

      toast.success("Folder upload complete", {
        id: toastId,
        description: `${files.length} files uploaded`,
      });

      await queryClient.invalidateQueries({
        queryKey: trpc.sandbox.list.queryKey({
          sandboxId,
          path: uploadBasePath,
        }),
      });
    } catch (error) {
      console.error("[sandbox] folder upload failed:", error);

      toast.error("Folder upload failed", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });

      await queryClient.invalidateQueries({
        queryKey: trpc.sandbox.list.queryKey({
          sandboxId,
          path: uploadBasePath,
        }),
      });
    } finally {
      event.target.value = "";
    }
  };

  // ---------------------------------------------------------------------------
  // Download
  // ---------------------------------------------------------------------------

  const handleDownload = async (path: string) => {
    const toastId = toast.loading("Preparing download...");

    try {
      const params = new URLSearchParams({
        path,
      });

      const url = `/api/sandbox/${encodeURIComponent(
        sandboxId,
      )}/download?${params.toString()}`;

      toast.loading("Downloading...", {
        id: toastId,
      });

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.text();

        throw new Error(error || `Download failed (${response.status})`);
      }

      const blob = await response.blob();

      const downloadUrl = URL.createObjectURL(blob);

      const filename =
        response.headers
          .get("Content-Disposition")
          ?.match(/filename="?([^"]+)"?/)?.[1] ||
        path.split("/").filter(Boolean).pop() ||
        "download";

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);

      toast.success("Download started", {
        id: toastId,
      });
    } catch (error) {
      console.error("[sandbox download]", error);

      toast.error(error instanceof Error ? error.message : "Download failed", {
        id: toastId,
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  const isMutating =
    createFileMutation.isPending ||
    uploadFileMutation.isPending ||
    uploadZipMutation.isPending ||
    createFolderMutation.isPending ||
    renameMutation.isPending ||
    deleteMutation.isPending;

  const isUploading =
    uploadFileMutation.isPending || uploadZipMutation.isPending;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex h-full min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-border/50 bg-background">
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}

      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/40 px-2">
        <div className="flex min-w-0 items-center">
          <span className="truncate px-1 text-[11px] font-medium tracking-tight text-foreground/80">
            Explorer
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <ExplorerButton title="New file" onClick={openCreateFileDialog}>
            <FilePlus className="size-3.5" />
          </ExplorerButton>

          <ExplorerButton title="New folder" onClick={openCreateFolderDialog}>
            <FolderPlus className="size-3.5" />
          </ExplorerButton>

          <ExplorerButton
            title="Refresh"
            disabled={isLoading}
            onClick={() => void refetch()}
          >
            <RefreshCw
              className={["size-3.5", isLoading && "animate-spin"]
                .filter(Boolean)
                .join(" ")}
            />
          </ExplorerButton>

          <div className="relative">
            <ExplorerButton
              title="More"
              onClick={() => setShowMenu((value) => !value)}
            >
              <MoreHorizontal className="size-3.5" />
            </ExplorerButton>

            {showMenu && (
              <div className="absolute right-0 top-8 z-50 w-40 overflow-hidden rounded-lg border border-border/60 bg-popover p-1 shadow-xl shadow-black/10">
                <MenuItem
                  icon={<FilePlus className="size-3.5" />}
                  onClick={openCreateFileDialog}
                >
                  New file
                </MenuItem>

                <MenuItem
                  icon={<FolderPlus className="size-3.5" />}
                  onClick={openCreateFolderDialog}
                >
                  New folder
                </MenuItem>

                <MenuItem
                  icon={<RefreshCw className="size-3.5" />}
                  onClick={() => {
                    setShowMenu(false);
                    void refetch();
                  }}
                >
                  Refresh
                </MenuItem>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* NAVIGATION */}
      {/* ================================================================== */}

      <div className="flex h-8 shrink-0 items-center border-b border-border/40 px-1">
        <ExplorerButton
          title="Back"
          disabled={historyIndex === 0}
          onClick={goBack}
        >
          <ChevronLeft className="size-3.5" />
        </ExplorerButton>

        <ExplorerButton
          title="Forward"
          disabled={historyIndex >= history.length - 1}
          onClick={goForward}
        >
          <ChevronRight className="size-3.5" />
        </ExplorerButton>

        <ExplorerButton
          title="Parent directory"
          disabled={currentPath === "/"}
          onClick={goUp}
        >
          <ChevronRight className="size-3.5 rotate-[-90deg]" />
        </ExplorerButton>

        <div className="ml-1 h-4 w-px bg-border/40" />
      </div>

      {/* ================================================================== */}
      {/* BREADCRUMB */}
      {/* ================================================================== */}

      <div className="flex h-8 min-w-0 shrink-0 items-center gap-1 overflow-x-auto border-b border-border/40 px-2 scrollbar-none">
        <button
          type="button"
          onClick={() => navigateTo("/")}
          className={[
            "shrink-0 text-[10px] transition-colors",
            currentPath === "/"
              ? "font-medium text-foreground"
              : "text-muted-foreground/60 hover:text-foreground",
          ].join(" ")}
        >
          /
        </button>

        {breadcrumbs.map((part, index) => {
          const path = "/" + breadcrumbs.slice(0, index + 1).join("/");

          const isCurrent = path === currentPath;

          return (
            <div key={path} className="flex shrink-0 items-center gap-1">
              <ChevronRight className="size-2.5 text-muted-foreground/30" />

              <button
                type="button"
                onClick={() => navigateTo(path)}
                className={[
                  "max-w-24 truncate text-[10px] transition-colors",
                  isCurrent
                    ? "font-medium text-foreground"
                    : "text-muted-foreground/60 hover:text-foreground",
                ].join(" ")}
              >
                {part}
              </button>
            </div>
          );
        })}
      </div>

      {/* ================================================================== */}
      {/* FILE TREE */}
      {/* ================================================================== */}

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-1">
        {isLoading && (
          <div className="flex items-center gap-2 px-2.5 py-4 text-[10px] text-muted-foreground/60">
            <Loader2 className="size-3 animate-spin" />
            Loading files...
          </div>
        )}

        {error && (
          <div className="px-2.5 py-4 text-[10px] leading-relaxed text-destructive">
            {error.message}
          </div>
        )}

        {!isLoading && !error && sortedFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center px-3 py-12 text-center">
            <Folder className="mb-2 size-6 text-muted-foreground/20" />

            <p className="text-[10px] text-muted-foreground/50">
              Empty directory
            </p>

            <button
              type="button"
              onClick={openCreateFileDialog}
              className="mt-3 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Create a file
            </button>
          </div>
        )}

        {!isLoading && !error && sortedFiles.length > 0 && (
          <div className="space-y-px">
            {sortedFiles.map((file) => {
              const isDirectory = file.type === "dir";

              const isSelected = selectedFile === file.path;

              return (
                <div
                  key={file.path}
                  className={[
                    "group flex min-w-0 items-center rounded-[6px]",
                    "transition-colors duration-100",
                    isSelected
                      ? "bg-foreground/[0.07]"
                      : "hover:bg-foreground/[0.045]",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() =>
                      isDirectory
                        ? handleDirectoryClick(file.path)
                        : handleFileClick(file.path)
                    }
                    className="flex min-w-0 flex-1 items-center gap-1.5 px-2 py-[5px] text-left outline-none"
                  >
                    <FileIcon
                      name={file.name}
                      isDirectory={isDirectory}
                      open={isDirectory && currentPath === file.path}
                    />

                    <span
                      className={[
                        "min-w-0 truncate text-[11px]",
                        isSelected ? "text-foreground" : "text-foreground/70",
                      ].join(" ")}
                    >
                      {file.name}
                    </span>
                  </button>

                  <div className="hidden shrink-0 items-center gap-px pr-1 group-hover:flex">
                    <RowAction
                      title="Download"
                      onClick={() => handleDownload(file.path)}
                    >
                      <Download className="size-3" />
                    </RowAction>

                    <RowAction
                      title="Rename"
                      onClick={() => openRenameDialog(file.path, file.name)}
                    >
                      <Pencil className="size-3" />
                    </RowAction>

                    <RowAction
                      title="Delete"
                      destructive
                      onClick={() => openDeleteDialog(file.path, file.name)}
                    >
                      <Trash2 className="size-3" />
                    </RowAction>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* HIDDEN FILE INPUTS */}
      {/* ================================================================== */}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleUpload}
      />

      <input
        ref={folderInputRef}
        type="file"
        className="hidden"
        {...({
          webkitdirectory: "",
          directory: "",
        } as React.InputHTMLAttributes<HTMLInputElement>)}
        onChange={handleFolderUpload}
      />

      {/* ================================================================== */}
      {/* DIALOGS */}
      {/* ================================================================== */}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {/* ============================================================ */}
          {/* NEW FILE */}
          {/* ============================================================ */}

          {dialogMode === "file" && (
            <>
              <DialogHeader>
                <DialogTitle>New file</DialogTitle>

                <DialogDescription>
                  Create a new file in{" "}
                  <span className="font-mono text-xs">{currentPath}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  autoFocus
                  value={dialogValue}
                  onChange={(event) => setDialogValue(event.target.value)}
                  onKeyDown={handleDialogKeyDown}
                  placeholder="example.ts"
                  disabled={isMutating}
                />

                <div className="relative flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />

                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">
                    or
                  </span>

                  <div className="h-px flex-1 bg-border" />
                </div>

                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={isMutating}
                  className="
                    flex w-full items-center gap-3
                    rounded-lg
                    border border-dashed
                    border-border/70
                    px-3 py-3
                    text-left
                    transition-colors
                    hover:border-border
                    hover:bg-muted/40
                    disabled:pointer-events-none
                    disabled:opacity-50
                  "
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    {isUploading ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Download className="size-4 rotate-180 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium">
                      {isUploading ? "Uploading..." : "Upload file"}
                    </p>

                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Choose a file from your computer
                    </p>
                  </div>
                </button>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetDialog}
                  disabled={isMutating}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={() => void handleCreateFile()}
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

          {/* ============================================================ */}
          {/* NEW FOLDER */}
          {/* ============================================================ */}

          {dialogMode === "folder" && (
            <>
              <DialogHeader>
                <DialogTitle>New folder</DialogTitle>

                <DialogDescription>
                  Create a new folder in{" "}
                  <span className="font-mono text-xs">{currentPath}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  autoFocus
                  value={dialogValue}
                  onChange={(event) => setDialogValue(event.target.value)}
                  onKeyDown={handleDialogKeyDown}
                  placeholder="components"
                  disabled={isMutating}
                />

                <div className="relative flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />

                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">
                    or
                  </span>

                  <div className="h-px flex-1 bg-border" />
                </div>

                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  disabled={isMutating}
                  className="
                    flex w-full items-center gap-3
                    rounded-lg
                    border border-dashed
                    border-border/70
                    px-3 py-3
                    text-left
                    transition-colors
                    hover:border-border
                    hover:bg-muted/40
                    disabled:pointer-events-none
                    disabled:opacity-50
                  "
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    {uploadZipMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <FolderPlus className="size-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium">Upload folder</p>

                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      Choose a folder and upload all its files
                    </p>
                  </div>
                </button>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetDialog}
                  disabled={isMutating}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={() => void handleCreateFolder()}
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

          {/* ============================================================ */}
          {/* RENAME */}
          {/* ============================================================ */}

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
                disabled={isMutating}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetDialog}
                  disabled={isMutating}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={() => void handleRename()}
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

          {/* ============================================================ */}
          {/* DELETE */}
          {/* ============================================================ */}

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
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetDialog}
                  disabled={isMutating}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => void handleDelete()}
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

// =============================================================================
// Small UI components
// =============================================================================

interface ExplorerButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  disabled?: boolean;
}

function ExplorerButton({
  children,
  onClick,
  title,
  disabled = false,
}: ExplorerButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex size-7 items-center justify-center rounded-[6px]",
        "text-muted-foreground/55",
        "outline-none transition-all duration-100",
        "hover:bg-foreground/[0.06] hover:text-foreground",
        "focus-visible:ring-1 focus-visible:ring-ring/50",
        "active:scale-[0.96]",
        "disabled:pointer-events-none disabled:opacity-20",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

interface RowActionProps {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  destructive?: boolean;
}

function RowAction({
  children,
  onClick,
  title,
  destructive = false,
}: RowActionProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "inline-flex size-6 items-center justify-center rounded-[5px]",
        "text-muted-foreground/50 transition-colors",
        "hover:bg-background hover:text-foreground",
        destructive && "hover:text-destructive",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

interface MenuItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}

function MenuItem({ children, icon, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex h-8 w-full items-center gap-2
        rounded-[6px]
        px-2
        text-[11px]
        text-muted-foreground
        transition-colors
        hover:bg-foreground/[0.06]
        hover:text-foreground
      "
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
