import { agentDefinition } from "./agent/agent-definition";
import { functionDefinition } from "./function/function-definition";
import { NodeDefinition } from "./types/node-definition";

export const registry: NodeDefinition<any>[] = [
  agentDefinition,
  functionDefinition,
];
