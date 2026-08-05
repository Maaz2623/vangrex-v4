export interface ExecutionArtifact {
  id: string;
  nodeId: string;
  type: "text" | "json" | "file" | "image";
  value: unknown;
  createdAt: number;
}
