import { useMemo } from "react";
import { registry } from "../registry";

export const useNodeDefinitions = () => {
  const definitions = useMemo(() => registry, []);

  const grouped = useMemo(() => {
    return Object.groupBy(definitions, (definition) => definition.category);
  }, [definitions]);

  return {
    definitions,
    grouped,
  };
};
