import { streams } from "@trigger.dev/sdk";

import { NodeStatusType } from "@/features/canvas/components/nodes/types";
import { ExecutionOutput } from "@/features/canvas/services/execution/execution-output";

export const nodeStatusStream = streams.define<{
  executionId: string;
  nodeId: string;
  status: NodeStatusType;
}>({
  id: "node-status",
});

export const nodeOutputStream = streams.define<{
  executionId: string;
  nodeId: string;
  output: ExecutionOutput;
}>({
  id: "node-output",
});

export const terminalOutputStream = streams.define<{
  sandboxId: string;
  pid: number;
  data: string;
}>({
  id: "terminal-output",
});

export const terminalInputStream = streams.input<{
  pid: number;
  data: string;
}>({
  id: "terminal-input",
});

export const terminalReadyStream = streams.define<{
  pid: number;
}>({
  id: "terminal-ready",
});
