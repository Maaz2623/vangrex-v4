export type ExecutionEvent =
  | {
      type: "node:start";
      nodeId: string;
      nodeName: string;
      timestamp: number;
    }
  | {
      type: "node:success";
      nodeId: string;
      nodeName: string;
      timestamp: number;
      duration: number;
    }
  | {
      type: "node:error";
      nodeId: string;
      nodeName: string;
      error: Error;
      timestamp: number;
      duration: number;
    }
  | {
      type: "tool:start";
      nodeId: string;
      nodeName: string;
      timestamp: number;
    }
  | {
      type: "tool:success";
      nodeId: string;
      nodeName: string;
      timestamp: number;
    }
  | {
      type: "tool:error";
      nodeId: string;
      nodeName: string;
      error: Error;
      timestamp: number;
    }
  | {
      type: "edge:start";
      edgeId: string;
      timestamp: number;
    }
  | {
      type: "edge:success";
      edgeId: string;
      timestamp: number;
    }
  | {
      type: "edge:error";
      edgeId: string;
      error: Error;
      timestamp: number;
    };
