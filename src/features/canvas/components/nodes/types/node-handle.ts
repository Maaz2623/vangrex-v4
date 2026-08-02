import { Position } from "@xyflow/react";

export type HandleDirection = "source" | "target";

export type HandleDataType =
  | "any"
  | "text"
  | "json"
  | "number"
  | "boolean"
  | "image"
  | "file"
  | "embedding"
  | "tool-call";

export interface NodeHandle {
  id: string;
  name: string;
  direction: HandleDirection;
  position: Position;
  dataType: HandleDataType;
  multiple?: boolean;
}


