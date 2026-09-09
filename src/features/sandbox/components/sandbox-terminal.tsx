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
   * Create terminal
   */
  useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",

      fontFamily:
        '"Fira Code", "JetBrains Mono", "SFMono-Regular", Consolas, monospace',

      fontSize: 13,
      lineHeight: 1.4,
      fontWeight: "400",

      // fontLigatures: true,

      scrollback: 5000,
      convertEol: false,

      theme: {
        background: "#0B0F14",
        foreground: "#E2E8F0",
        cursor: "#F8FAFC",

        black: "#0B0F14",
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

      cursorWidth: 1,
    });

    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);

    terminal.open(terminalRef.current);

    /*
     * Fit after the terminal has actually been mounted.
     */
    requestAnimationFrame(() => {
      fitAddon.fit();
    });

    terminal.writeln("\x1b[1;36mVangrex Sandbox Terminal\x1b[0m");

    terminal.writeln(`\x1b[90mSandbox:\x1b[0m ${sandboxId}`);

    terminal.writeln("");

    terminalInstanceRef.current = terminal;

    /*
     * Re-fit whenever the terminal container changes size.
     */
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        try {
          fitAddon.fit();
        } catch {
          // Terminal may already be disposed.
        }
      });
    });

    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();

      terminal.dispose();

      terminalInstanceRef.current = null;
    };
  }, [sandboxId]);

  /*
   * Terminal input
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
   * Terminal output
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
   * Reset output tracking when changing runs.
   */
  useEffect(() => {
    lastOutputIndexRef.current = 0;
  }, [runId]);

  /*
   * Stream errors
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
    <div className="flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden bg-[#0B0F14]">
      <div
        ref={terminalRef}
        className="min-h-0 min-w-0 w-full flex-1 overflow-hidden p-2"
      />
    </div>
  );
}
