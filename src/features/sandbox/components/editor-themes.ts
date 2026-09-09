import type { editor } from "monaco-editor";

export const vangrexDarkTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6B7280" },
    { token: "keyword", foreground: "C084FC" },
    { token: "string", foreground: "86EFAC" },
    { token: "number", foreground: "FDE68A" },
    { token: "type", foreground: "67E8F9" },
    { token: "function", foreground: "93C5FD" },
    { token: "variable", foreground: "E5E7EB" },
  ],
  colors: {
    "editor.background": "#0B0D10",
    "editor.foreground": "#E5E7EB",
    "editorLineNumber.foreground": "#4B5563",
    "editorLineNumber.activeForeground": "#9CA3AF",
    "editorCursor.foreground": "#FFFFFF",

    "editor.lineHighlightBackground": "#11151B",
    "editor.selectionBackground": "#26364D",
    "editor.inactiveSelectionBackground": "#1B2533",

    "editorIndentGuide.background1": "#1A1F27",
    "editorIndentGuide.activeBackground1": "#2A313C",

    "editorWhitespace.foreground": "#252B34",

    "editorBracketMatch.background": "#1E293B",
    "editorBracketMatch.border": "#475569",

    "editorWidget.background": "#11151B",
    "editorWidget.border": "#272D36",

    "editorSuggestWidget.background": "#11151B",
    "editorSuggestWidget.border": "#272D36",
    "editorSuggestWidget.selectedBackground": "#1E293B",

    "input.background": "#11151B",
    "input.border": "#303640",

    "scrollbarSlider.background": "#37415188",
    "scrollbarSlider.hoverBackground": "#4B556388",
    "scrollbarSlider.activeBackground": "#6B728088",

    "minimap.background": "#0B0D10",
  },
};

export const midnightTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#08090C",
    "editor.foreground": "#D1D5DB",
    "editorLineNumber.foreground": "#374151",
    "editorLineNumber.activeForeground": "#9CA3AF",
    "editorCursor.foreground": "#FFFFFF",
    "editor.lineHighlightBackground": "#0F1117",
    "editor.selectionBackground": "#243047",
    "editorIndentGuide.background1": "#161A21",
    "editorIndentGuide.activeBackground1": "#252B35",
    "editorWidget.background": "#0F1117",
    "editorWidget.border": "#252B35",
    "editorSuggestWidget.background": "#0F1117",
    "editorSuggestWidget.border": "#252B35",
    "editorSuggestWidget.selectedBackground": "#1B2433",
    "scrollbarSlider.background": "#37415166",
    "scrollbarSlider.hoverBackground": "#4B556188",
  },
};

export const slateTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: false,

  rules: [
    // Comments
    { token: "comment", foreground: "64748B", fontStyle: "italic" },

    // Keywords
    { token: "keyword", foreground: "C084FC" },
    { token: "keyword.control", foreground: "C084FC" },

    // Strings
    { token: "string", foreground: "86EFAC" },
    { token: "string.escape", foreground: "FCA5A5" },

    // Numbers
    { token: "number", foreground: "FDE68A" },

    // Types / classes
    { token: "type", foreground: "67E8F9" },
    { token: "type.identifier", foreground: "67E8F9" },
    { token: "class", foreground: "67E8F9" },

    // Functions
    { token: "function", foreground: "93C5FD" },
    { token: "function.call", foreground: "93C5FD" },

    // Variables
    { token: "variable", foreground: "E2E8F0" },
    { token: "variable.predefined", foreground: "F0ABFC" },

    // Constants
    { token: "constant", foreground: "FBBF24" },

    // Operators
    { token: "operator", foreground: "CBD5E1" },

    // Delimiters
    { token: "delimiter", foreground: "94A3B8" },
    { token: "delimiter.bracket", foreground: "CBD5E1" },

    // Regex
    { token: "regexp", foreground: "FCA5A5" },

    // Tags / HTML
    { token: "tag", foreground: "F472B6" },
    { token: "attribute.name", foreground: "67E8F9" },
    { token: "attribute.value", foreground: "86EFAC" },
  ],

  colors: {
    // Editor
    "editor.background": "#0F172A",
    "editor.foreground": "#E2E8F0",

    // Cursor
    "editorCursor.foreground": "#F8FAFC",

    // Lines
    "editorLineNumber.foreground": "#475569",
    "editorLineNumber.activeForeground": "#CBD5E1",

    "editor.lineHighlightBackground": "#172033",

    // Selection
    "editor.selectionBackground": "#334155",
    "editor.inactiveSelectionBackground": "#1E293B",

    // Indentation
    "editorIndentGuide.background1": "#1E293B",
    "editorIndentGuide.activeBackground1": "#334155",

    // Whitespace
    "editorWhitespace.foreground": "#334155",

    // Brackets
    "editorBracketMatch.background": "#1E293B",
    "editorBracketMatch.border": "#64748B",

    // Widgets
    "editorWidget.background": "#111827",
    "editorWidget.border": "#334155",

    // Suggestions
    "editorSuggestWidget.background": "#111827",
    "editorSuggestWidget.border": "#334155",
    "editorSuggestWidget.selectedBackground": "#1E293B",
    "editorSuggestWidget.highlightForeground": "#93C5FD",

    // Input
    "input.background": "#111827",
    "input.border": "#334155",
    "input.foreground": "#E2E8F0",

    // Scrollbars
    "scrollbarSlider.background": "#47556966",
    "scrollbarSlider.hoverBackground": "#64748B88",
    "scrollbarSlider.activeBackground": "#94A3B8AA",

    // Minimap
    "minimap.background": "#0F172A",

    // Find
    "editor.findMatchBackground": "#854D0E66",
    "editor.findMatchHighlightBackground": "#854D0E33",

    // Error / warning
    "editorError.foreground": "#F87171",
    "editorWarning.foreground": "#FBBF24",
    "editorInfo.foreground": "#60A5FA",
  },
};
