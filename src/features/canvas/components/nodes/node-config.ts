import { AgentFlowNode, FunctionFlowNode, GithubFlowNode, OutputFlowNode } from "./types";
import { SandboxFlowNode } from "./types/sandbox-node";
import { ToolFlowNode } from "./types/tool-node";
import { VariableFlowNode } from "./types/variable-node";

export type NodeConfig = Record<string, unknown>;

export type AppFlowNode =
  | ToolFlowNode
  | AgentFlowNode
  | VariableFlowNode
  | OutputFlowNode
  | SandboxFlowNode
