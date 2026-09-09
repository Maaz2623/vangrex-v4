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
    <div className="flex h-full min-h-0 flex-col bg-[#0F172A]">
      {/* Editor toolbar */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border/60 bg-background px-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="truncate px-2 text-xs text-muted-foreground">
            {selectedFile.split("/").pop()}
          </div>

          {isDirty && !saveFileMutation.isPending && (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-current" />
              Unsaved
            </span>
          )}

          {saveFileMutation.isPending && (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-3 animate-spin rounded-full border border-muted-foreground border-t-transparent" />
              Saving...
            </span>
          )}

          {!isDirty && !saveFileMutation.isPending && !saveError && (
            <span className="text-[11px] text-muted-foreground">Saved</span>
          )}

          {saveError && (
            <span
              className="max-w-48 truncate text-[11px] text-destructive"
              title={saveError}
            >
              Failed to save
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Copy selection"
          >
            Copy
          </button>

          <button
            type="button"
            onClick={formatDocument}
            className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Format document"
          >
            Format
          </button>

          <button
            type="button"
            onClick={toggleWordWrap}
            className={`rounded px-2 py-1 text-xs ${
              wordWrap === "on"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title="Toggle word wrap"
          >
            Wrap
          </button>

          <button
            type="button"
            onClick={decreaseFontSize}
            className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Decrease font size"
          >
            A−
          </button>

          <button
            type="button"
            onClick={resetFontSize}
            className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Reset font size"
          >
            A
          </button>

          <button
            type="button"
            onClick={increaseFontSize}
            className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Increase font size"
          >
            A+
          </button>
        </div>
      </div>

      {/* Monaco */}
      <div className="min-h-0 flex-1">
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
      <div className="flex h-6 shrink-0 items-center justify-between border-t border-border/60 bg-background px-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>{getLanguage(selectedFile)}</span>

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
