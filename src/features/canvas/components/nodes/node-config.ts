import { AgentFlowNode, FunctionFlowNode } from "./types";
import { ToolFlowNode } from "./types/tool-node";
import { VariableFlowNode } from "./types/variable-node";

export type NodeConfig = Record<string, unknown>;

export type AppFlowNode = ToolFlowNode | AgentFlowNode | VariableFlowNode;
