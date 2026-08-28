import { NodeTypes } from "@xyflow/react";
import { AgentNode } from "./agent/agent-node";
import { agentDefinition } from "./agent/agent-definition";
import { functionDefinition } from "./function/function-definition";
import { toolDefinition } from "./tool/tool-definition";
import { variableDefinition } from "./variable/variable-definition";
import { outputDefinition } from "./output/output-definition";
import { githubDefinition } from "./github/github-definition";

export const nodeTypes: NodeTypes = {
  [agentDefinition.type]: agentDefinition.component,
  [functionDefinition.type]: functionDefinition.component,
  [toolDefinition.type]: toolDefinition.component,
  [variableDefinition.type]: variableDefinition.component,
  [outputDefinition.type]: outputDefinition.component,
  [githubDefinition.type]: githubDefinition.component,
};
