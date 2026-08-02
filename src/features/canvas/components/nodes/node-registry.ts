import { NodeTypes } from "@xyflow/react";
import { AgentNode } from "./agent/agent-node";
import { agentDefinition } from "./agent/agent-definition";
import { functionDefinition } from "./function/function-definition";
import { toolDefinition } from "./tool/tool-definition";

export const nodeTypes: NodeTypes = {
  [agentDefinition.type]: agentDefinition.component,
  [functionDefinition.type]: functionDefinition.component,
  [toolDefinition.type]: toolDefinition.component,
};
