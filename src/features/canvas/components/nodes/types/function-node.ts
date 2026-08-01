import { BaseNodeData } from "./base-node";

export interface FunctionConfig {
  runtime: "javascript" | "python";

  source: string;

  timeout: number;
}

export type FunctionNodeData = BaseNodeData<FunctionConfig>;
