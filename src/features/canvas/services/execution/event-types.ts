export type ExecutionEvent =
  | {
      type: "node:start";
      nodeId: string;
    }
  | {
      type: "node:success";
      nodeId: string;
    }
  | {
      type: "node:error";
      nodeId: string;
      error: Error;
    };
