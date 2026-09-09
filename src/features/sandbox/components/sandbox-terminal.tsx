"use client";

import { useEffect, useRef } from "react";

import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";

import {
  useInputStreamSend,
  useRealtimeStream,
} from "@trigger.dev/react-hooks";

import "@xterm/xterm/css/xterm.css";

import {
  terminalInputStream,
  terminalOutputStream,
  terminalReadyStream,
} from "@/trigger/streams";

interface SandboxTerminalProps {
  sandboxId: string;
  runId: string;
  accessToken: string;
}

export function SandboxTerminal({
  sandboxId,
  runId,
  accessToken,
}: SandboxTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);

  const lastOutputIndexRef = useRef(0);

  const { parts: outputParts, error: outputError } = useRealtimeStream(
    terminalOutputStream,
    runId,
    {
      accessToken,
    },
  );

  const { parts: readyParts, error: readyError } = useRealtimeStream(
    terminalReadyStream,
    runId,
    {
      accessToken,
    },
  );

  const {
    send,
    isReady,
    error: inputError,
  } = useInputStreamSend(terminalInputStream.id, runId, {
    accessToken,
  });

  const pid = readyParts?.at(-1)?.pid ?? null;

  /*
   * ---------------------------------------------------------
   * Create xterm instance
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",

      fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",

      fontSize: 13,
      lineHeight: 1.4,

      theme: {
        background: "#0F172A",
        foreground: "#E2E8F0",
        cursor: "#F8FAFC",

        black: "#0F172A",
        red: "#F87171",
        green: "#86EFAC",
        yellow: "#FDE68A",
        blue: "#93C5FD",
        magenta: "#C084FC",
        cyan: "#67E8F9",
        white: "#E2E8F0",

        brightBlack: "#475569",
        brightRed: "#FCA5A5",
        brightGreen: "#BBF7D0",
        brightYellow: "#FEF08A",
        brightBlue: "#BFDBFE",
        brightMagenta: "#E9D5FF",
        brightCyan: "#A5F3FC",
        brightWhite: "#F8FAFC",
      },

      scrollback: 5000,
      convertEol: false,
    });

    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);

    // Give xterm a frame to calculate its initial dimensions.
    requestAnimationFrame(() => {
      fitAddon.fit();
    });

    terminal.writeln("\x1b[1;36mVangrex Sandbox Terminal\x1b[0m");

    terminal.writeln(`\x1b[90mSandbox:\x1b[0m ${sandboxId}`);

    terminal.writeln("");

    terminalInstanceRef.current = terminal;

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });

    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      terminal.dispose();

      terminalInstanceRef.current = null;
    };
  }, [sandboxId]);

  /*
   * ---------------------------------------------------------
   * Send keyboard input → Trigger input stream → PTY
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const terminal = terminalInstanceRef.current;

    if (!terminal) return;
    if (!isReady) return;
    if (pid === null) return;

    const disposable = terminal.onData((data) => {
      void send({
        pid,
        data,
      });
    });

    return () => {
      disposable.dispose();
    };
  }, [send, isReady, pid]);

  /*
   * ---------------------------------------------------------
   * PTY output → Trigger realtime stream → xterm
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const terminal = terminalInstanceRef.current;

    if (!terminal) return;
    if (!outputParts) return;

    const startIndex = lastOutputIndexRef.current;

    const newParts = outputParts.slice(startIndex);

    for (const part of newParts) {
      terminal.write(part.data);
    }

    lastOutputIndexRef.current = outputParts.length;
  }, [outputParts]);

  /*
   * ---------------------------------------------------------
   * Reset output cursor when run changes
   * ---------------------------------------------------------
   */

  useEffect(() => {
    lastOutputIndexRef.current = 0;
  }, [runId]);

  /*
   * ---------------------------------------------------------
   * Errors
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (outputError) {
      console.error("[terminal] output stream error:", outputError);
    }

    if (readyError) {
      console.error("[terminal] ready stream error:", readyError);
    }

    if (inputError) {
      console.error("[terminal] input stream error:", inputError);
    }
  }, [outputError, readyError, inputError]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0F172A]">
      {/* Terminal header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border/60 bg-background px-3">
        <div className="flex items-center gap-2">
          <div
            className={`size-2 rounded-full ${
              isReady && pid !== null ? "bg-emerald-500" : "bg-yellow-500"
            }`}
          />

          <span className="text-xs font-medium">Terminal</span>
        </div>

        <div className="flex items-center gap-2">
          {!isReady && (
            <span className="text-[11px] text-muted-foreground">
              Connecting...
            </span>
          )}

          {isReady && pid !== null && (
            <span className="text-[11px] text-emerald-500">Connected</span>
          )}

          <button
            type="button"
            className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => {
              terminalInstanceRef.current?.clear();
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div ref={terminalRef} className="min-h-0 flex-1 overflow-hidden p-2" />
    </div>
  );
}
