"use client";

import { useEffect, useRef } from "react";
import { useExecutionStore } from "../../store/execution-store";
import { ExecutionLogItem } from "./execution-log-item";

export const ExecutionPanel = () => {
  const { logs } = useExecutionStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [logs]);

  return (
    <div className="flex h-full flex-col border-l border-border bg-background">
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-semibold">Execution Console</h2>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-sm">
        {logs.map((log) => (
          <ExecutionLogItem key={log.id} log={log} />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
