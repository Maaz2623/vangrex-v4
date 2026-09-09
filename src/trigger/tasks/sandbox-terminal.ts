import { task } from "@trigger.dev/sdk";

import { sandboxManager } from "@/lib/sandbox/sandbox-manager";

import { terminalInputStream, terminalOutputStream, terminalReadyStream } from "../streams";

export const sandboxTerminalTask = task({
  id: "sandbox-terminal",

  run: async (payload: { sandboxId: string; cols: number; rows: number }) => {
    const sandboxInstance = await sandboxManager.get(payload.sandboxId);

    const decoder = new TextDecoder();

    const terminal = await sandboxInstance.sandbox.pty.create({
      cols: payload.cols,
      rows: payload.rows,
      cwd: "/home/user",
      timeoutMs: 0,

      onData: async (data) => {
        const text = decoder.decode(data, {
          stream: true,
        });

        if (!text) return;

        await terminalOutputStream.append({
          sandboxId: payload.sandboxId,
          pid: terminal.pid,
          data: text,
        });
      },
    });

    await terminalReadyStream.append({
      pid: terminal.pid,
    });

    console.log(`[terminal] started ${terminal.pid}`);

    terminalInputStream.on(async (input) => {
      if (input.pid !== terminal.pid) {
        return;
      }

      await sandboxInstance.sandbox.pty.sendInput(
        terminal.pid,
        new TextEncoder().encode(input.data),
      );
    });

    await terminal.wait();

    console.log(`[terminal] exited ${terminal.pid}`);

    return {
      pid: terminal.pid,
    };
  },
});
