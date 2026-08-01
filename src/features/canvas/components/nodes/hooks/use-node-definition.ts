import { registry } from "../registry";

export const useNodeDefinition = (type: string) => {
  return registry.find((definition) => definition.type === type);
};
