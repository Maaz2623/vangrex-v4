import { EdgeTypes } from "@xyflow/react";
import { edgeRegistry } from "./registry";

export const edgeTypes: EdgeTypes = Object.fromEntries(
  edgeRegistry.map((edge) => [edge.type, edge.component]),
);
