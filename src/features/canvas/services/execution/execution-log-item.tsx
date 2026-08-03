"use client";

import { ExecutionLog } from "../../store/execution-store";

interface Props {
  log: ExecutionLog;
}

export const ExecutionLogItem = ({ log }: Props) => {
  const time = new Date(log.timestamp).toLocaleTimeString();

  const getMessage = () => {
    switch (log.event.type) {
      case "node:start":
        return `> Starting node ${log.event.nodeName}`;

      case "node:error":
        return `✗ Node ${log.event.nodeName} failed (${Math.round(log.event.duration)})`;

      case "tool:start":
        return `> Executing tool ${log.event.nodeName}`;

      case "node:success":
        return `✓ ${log.event.nodeName} completed (${Math.round(log.event.duration)} ms)`;

      case "tool:error":
        return `✗ Tool ${log.event.nodeName} failed`;

      case "edge:start":
        return `> Traversing edge`;

      case "edge:success":
        return `✓ Edge completed`;

      case "edge:error":
        return `✗ Edge failed`;

      default:
        return "Return unknown event";
    }
  };

  const getColor = () => {
    switch (log.event.type) {
      case "node:error":
      case "tool:error":
      case "edge:error":
        return "text-red-500";

      case "node:success":
      case "tool:success":
      case "edge:success":
        return "text-green-500";

      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="flex gap-3 px-4 py-1 hover:bg-accent/40">
      <span className="w-20 shrink-0 text-xs text-muted-foreground">
        {time}
      </span>

      <span className={getColor()}>{getMessage()}</span>
    </div>
  );
};
