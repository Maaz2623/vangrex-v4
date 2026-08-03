export type ExecutionEvent =
  | {
      type: "node:start";
      nodeId: string;
      timestamp: number;
    }
  | {
      type: "node:success";
      nodeId: string;
      timestamp: number;
    }
  | {
      type: "node:error";
      nodeId: string;
      error: Error;
      timestamp: number;
    }
  | {
      type: "tool:start";
      nodeId: string;
      timestamp: number;
    }
  | {
      type: "tool:success";
      nodeId: string;
      timestamp: number;
    }
  | {
      type: "tool:error";
      nodeId: string;
      error: Error;
      timestamp: number;
    };
