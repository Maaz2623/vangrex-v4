import { sandboxManager } from "@/lib/sandbox/sandbox-manager";

export interface SandboxTerminal {
  pid: number;
}

export interface CreateTerminalOptions {
  cols?: number;
  rows?: number;
  cwd?: string;
}

type TerminalOutputListener = (data: Uint8Array) => void;

interface TerminalSession {
  pid: number;
  listeners: Set<TerminalOutputListener>;
}

class SandboxTerminalManager {
  private sessions = new Map<string, TerminalSession>();

  async create(
    sandboxId: string,
    options: CreateTerminalOptions = {},
  ): Promise<SandboxTerminal> {
    const sandboxInstance = await sandboxManager.get(sandboxId);

    const terminal = await sandboxInstance.sandbox.pty.create({
      cols: options.cols ?? 120,
      rows: options.rows ?? 30,
      cwd: options.cwd ?? "/home/user",
      timeoutMs: 0,

      onData: (data) => {
        const session = this.sessions.get(sandboxId);

        if (!session) return;

        for (const listener of session.listeners) {
          listener(data);
        }
      },
    });

    this.sessions.set(sandboxId, {
      pid: terminal.pid,
      listeners: new Set(),
    });

    return {
      pid: terminal.pid,
    };
  }

  async sendInput(sandboxId: string, pid: number, data: string): Promise<void> {
    const sandboxInstance = await sandboxManager.get(sandboxId);

    await sandboxInstance.sandbox.pty.sendInput(
      pid,
      new TextEncoder().encode(data),
    );
  }

  async resize(
    sandboxId: string,
    pid: number,
    cols: number,
    rows: number,
  ): Promise<void> {
    const sandboxInstance = await sandboxManager.get(sandboxId);

    await sandboxInstance.sandbox.pty.resize(pid, {
      cols,
      rows,
    });
  }

  async kill(sandboxId: string, pid: number): Promise<boolean> {
    const sandboxInstance = await sandboxManager.get(sandboxId);

    const killed = await sandboxInstance.sandbox.pty.kill(pid);

    this.sessions.delete(sandboxId);

    return killed;
  }

  subscribe(sandboxId: string, listener: TerminalOutputListener): () => void {
    const session = this.sessions.get(sandboxId);

    if (!session) {
      throw new Error("Terminal session not found");
    }

    session.listeners.add(listener);

    return () => {
      session.listeners.delete(listener);
    };
  }
}

export const sandboxTerminal = new SandboxTerminalManager();
