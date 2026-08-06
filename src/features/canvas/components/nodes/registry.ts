import { agentDefinition } from "./agent/agent-definition";
import { functionDefinition } from "./function/function-definition";
import { toolDefinition } from "./tool/tool-definition";
import { NodeDefinition } from "./types/node-definition";
import { variableDefinition } from "./variable/variable-definition";

export const registry: NodeDefinition<any>[] = [
  agentDefinition,
  toolDefinition,
  functionDefinition,
  variableDefinition,
];
