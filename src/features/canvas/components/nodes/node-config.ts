import { AgentFlowNode, FunctionFlowNode } from "./types";
import { ToolFlowNode } from "./types/tool-node";

export type NodeConfig = Record<string, unknown>;

export type AppFlowNode = ToolFlowNode | AgentFlowNode;
