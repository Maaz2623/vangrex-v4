import { AgentFlowNode, FunctionFlowNode } from "./types";

export type NodeConfig = Record<string, unknown>;

export type AppFlowNode = AgentFlowNode | FunctionFlowNode;
