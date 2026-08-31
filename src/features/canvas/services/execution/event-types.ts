import { ExecutionOutput } from "./execution-output";

export type ExecutionEvent =
  | {
      type: "node:start";
      executionId?: string;
      nodeId: string;
      nodeType: string;
      nodeName: string;
      timestamp: number;
    }
  | {
      type: "node:success";
      executionId?: string;
      nodeId: string;
      nodeType: string;
      nodeName: string;
      timestamp: number;
      duration: number;
      output?: ExecutionOutput
    }
  | {
      type: "node:error";
      executionId?: string;
      nodeId: string;
      nodeType: string;
      nodeName: string;
      error: Error;
      timestamp: number;
      duration: number;
    };
