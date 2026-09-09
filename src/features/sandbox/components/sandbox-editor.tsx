"use client";

import { useEffect, useRef, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";

import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";

import { useTRPC } from "@/trpc/client";

import { useSandboxExplorerStore } from "../stores/sandbox-explorer-store";

import { midnightTheme, slateTheme, vangrexDarkTheme } from "./editor-themes";

interface SandboxEditorProps {
  sandboxId: string;
}

export function SandboxEditor({ sandboxId }: SandboxEditorProps) {
  const trpc = useTRPC();

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<BeforeMount>[0] | null>(null);

  const [fontSize, setFontSize] = useState(13);
  const [wordWrap, setWordWrap] = useState<
    "on" | "off" | "wordWrapColumn" | "bounded"
  >("off");

  const saveFileMutation = useMutation(trpc.sandbox.write.mutationOptions());

  const { selectedFile, fileContents, setFileContent } =
    useSandboxExplorerStore();

  const {
    data: content,
    isLoading,
    error,
  } = useQuery({
    ...trpc.sandbox.read.queryOptions({
      sandboxId,
      path: selectedFile ?? "",
    }),
    enabled: Boolean(selectedFile),
  });

  /*
   * Register themes before Monaco creates the editor.
   */
  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("vangrex-dark", vangrexDarkTheme);
    monaco.editor.defineTheme("midnight", midnightTheme);
    monaco.editor.defineTheme("slate", slateTheme);

    monacoRef.current = monaco;
  };

  /**
   * Store the editor instance and register editor commands.
   */
  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;

    editor.focus();

    /**
     * Ctrl/Cmd + S
     */
    editor.addCommand(
      monacoRef.current!.KeyMod.CtrlCmd | monacoRef.current!.KeyCode.KeyS,
      () => {
        void handleSave();
      },
    );
  };

  const [isDirty, setIsDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * Save the current file.
   */
  const handleSave = async () => {
    if (!selectedFile || !editorRef.current) {
      return;
    }

    const value = editorRef.current.getValue();

    setSaveError(null);

    // Save locally immediately.
    setFileContent(selectedFile, value);

    try {
      await saveFileMutation.mutateAsync({
        sandboxId,
        path: selectedFile,
        content: value,
      });

      setIsDirty(false);

      console.log("[editor] saved:", selectedFile);
    } catch (error) {
      console.error("[editor] save failed:", error);

      setSaveError(
        error instanceof Error ? error.message : "Failed to save file",
      );
    }
  };

  /**
   * Copy the currently selected text.
   */
  const handleCopy = async () => {
    if (!editorRef.current) {
      return;
    }

    const selection = editorRef.current.getSelection();

    if (!selection || selection.isEmpty()) {
      return;
    }

    const model = editorRef.current.getModel();

    if (!model) {
      return;
    }

    const selectedText = model.getValueInRange(selection);

    if (!selectedText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(selectedText);
    } catch (error) {
      console.error("[editor] copy failed:", error);
    }
  };

  /**
   * Format the current document.
   */
  const formatDocument = async () => {
    if (!editorRef.current) {
      return;
    }

    try {
      const action = editorRef.current.getAction(
        "editor.action.formatDocument",
      );

      if (!action) {
        return;
      }

      await action.run();
    } catch (error) {
      console.error("[editor] format failed:", error);
    }
  };

  const toggleWordWrap = () => {
    const next = wordWrap === "off" ? "on" : "off";

    setWordWrap(next);

    editorRef.current?.updateOptions({
      wordWrap: next,
    });
  };

  const increaseFontSize = () => {
    const next = Math.min(fontSize + 1, 24);

    setFontSize(next);

    editorRef.current?.updateOptions({
      fontSize: next,
    });
  };

  const decreaseFontSize = () => {
    const next = Math.max(fontSize - 1, 10);

    setFontSize(next);

    editorRef.current?.updateOptions({
      fontSize: next,
    });
  };

  const resetFontSize = () => {
    setFontSize(13);

    editorRef.current?.updateOptions({
      fontSize: 13,
    });
  };

  /*
   * No file selected.
   */
  if (!selectedFile) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground">
        Select a file to open it
      </div>
    );
  }

  /*
   * Loading.
   */
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground">
        Loading file...
      </div>
    );
  }

  /*
   * Error.
   */
  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-background px-6 text-sm text-destructive">
        {error.message}
      </div>
    );
  }

  const value = fileContents[selectedFile] ?? content ?? "";

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Editor toolbar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/40 bg-background/90 px-3 backdrop-blur-sm">
        {/* File information */}
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="size-1.5 shrink-0 rounded-full bg-foreground/40" />

            <span className="truncate text-[12px] font-medium tracking-tight text-foreground/85">
              <div className="flex min-w-0 items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/30" />

                <span className="truncate text-[12px] font-medium tracking-[-0.01em] text-foreground/80">
                  {selectedFile.split("/").pop()}
                </span>
              </div>
            </span>
          </div>

          {isDirty && !saveFileMutation.isPending && (
            <span className="flex items-center gap-1.5 rounded-[6px] bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-amber-400/80" />
              Unsaved
            </span>
          )}

          {saveFileMutation.isPending && (
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
              <span className="size-2.5 animate-spin rounded-full border border-muted-foreground/30 border-t-foreground/70" />
              Saving
            </span>
          )}

          {!isDirty && !saveFileMutation.isPending && !saveError && (
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
              <span className="size-1.5 rounded-full bg-emerald-500/60" />
              Saved
            </span>
          )}

          {saveError && (
            <span
              className="max-w-48 truncate text-[10px] font-medium text-destructive/80"
              title={saveError}
            >
              Save failed
            </span>
          )}
        </div>

        {/* Editor controls */}
        <div className="flex items-center gap-0.5">
          <EditorButton onClick={handleCopy} title="Copy selection">
            Copy
          </EditorButton>

          <EditorButton onClick={formatDocument} title="Format document">
            Format
          </EditorButton>

          <EditorButton
            active={wordWrap === "on"}
            onClick={toggleWordWrap}
            title="Toggle word wrap"
          >
            Wrap
          </EditorButton>

          <div className="mx-1.5 h-4 w-px bg-border/50" />

          <EditorButton onClick={decreaseFontSize} title="Decrease font size">
            A−
          </EditorButton>

          <EditorButton onClick={resetFontSize} title="Reset font size">
            <span className="text-[10px]">A</span>
          </EditorButton>

          <EditorButton onClick={increaseFontSize} title="Increase font size">
            A+
          </EditorButton>
        </div>
      </div>

      {/* Monaco */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <Editor
          height="100%"
          theme="slate"
          value={value}
          language={getLanguage(selectedFile)}
          beforeMount={handleBeforeMount}
          onMount={handleMount}
          onChange={(value) => {
            if (value === undefined) {
              return;
            }

            setFileContent(selectedFile, value);
            setIsDirty(true);
            setSaveError(null);
          }}
          options={{
            fontSize,
            lineHeight: 21,

            padding: {
              top: 12,
              bottom: 12,
            },

            minimap: {
              enabled: false,
            },

            wordWrap,

            automaticLayout: true,

            scrollBeyondLastLine: false,

            smoothScrolling: true,

            cursorBlinking: "smooth",

            cursorSmoothCaretAnimation: "on",

            renderLineHighlight: "line",

            renderWhitespace: "selection",

            bracketPairColorization: {
              enabled: true,
            },

            guides: {
              bracketPairs: true,
              indentation: true,
              highlightActiveIndentation: true,
            },

            folding: true,

            foldingHighlight: true,

            showFoldingControls: "mouseover",

            stickyScroll: {
              enabled: true,
            },

            linkedEditing: true,

            occurrencesHighlight: "singleFile",

            selectionHighlight: true,

            unicodeHighlight: {
              ambiguousCharacters: false,
              invisibleCharacters: false,
            },

            suggest: {
              showMethods: true,
              showFunctions: true,
              showConstructors: true,
              showDeprecated: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showStructs: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showKeywords: true,
              showWords: true,
              showUsers: true,
              showSnippets: true,
            },

            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              useShadows: false,
            },

            overviewRulerBorder: false,

            hideCursorInOverviewRuler: true,

            contextmenu: true,

            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },

            parameterHints: {
              enabled: true,
            },

            hover: {
              enabled: "on",
              delay: 300,
            },

            find: {
              addExtraSpaceOnTop: true,
              autoFindInSelection: "never",
            },

            tabSize: 2,

            insertSpaces: true,

            detectIndentation: true,

            autoIndent: "full",

            formatOnPaste: true,

            formatOnType: true,

            dragAndDrop: true,

            mouseWheelZoom: true,
          }}
        />
      </div>

      {/* Status bar */}
      <div className="flex h-6 shrink-0 items-center justify-between border-t border-border/30 bg-background/70 px-3 text-[10px] text-muted-foreground/55">
        <div className="flex items-center gap-3">
          <span className="font-medium text-muted-foreground/70">
            {getLanguage(selectedFile)}
          </span>

          <span>UTF-8</span>

          <span>LF</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{fontSize}px</span>

          <span>{wordWrap === "on" ? "Wrap" : "No Wrap"}</span>
        </div>
      </div>
    </div>
  );
}

function getLanguage(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "ts":
    case "tsx":
      return "typescript";

    case "js":
    case "jsx":
      return "javascript";

    case "json":
      return "json";

    case "css":
      return "css";

    case "scss":
      return "scss";

    case "html":
      return "html";

    case "md":
      return "markdown";

    case "py":
      return "python";

    case "rs":
      return "rust";

    case "go":
      return "go";

    case "sql":
      return "sql";

    case "sh":
      return "shell";

    case "yaml":
    case "yml":
      return "yaml";

    case "xml":
      return "xml";

    case "graphql":
    case "gql":
      return "graphql";

    case "dockerfile":
      return "dockerfile";

    default:
      return "plaintext";
  }
}

interface EditorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  active?: boolean;
}

function EditorButton({
  children,
  onClick,
  title,
  active = false,
}: EditorButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        "inline-flex h-7 items-center justify-center rounded-[7px] px-2",
        "text-[10px] font-medium tracking-tight",
        "transition-all duration-150",
        "outline-none",
        "focus-visible:ring-1 focus-visible:ring-ring/50",
        active
          ? "bg-foreground/[0.08] text-foreground shadow-sm"
          : "text-muted-foreground/65 hover:bg-foreground/[0.06] hover:text-foreground",
        "active:scale-[0.97]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
