import { Handle, Position } from "@xyflow/react";

export const NodeHandles = () => {
  return (
    <>
      <Handle
        id="source-1"
        type="source"
        position={Position.Left}
        className="size-3! border-2! border-background!"
        
      />
      <Handle
        id="target-1"
        type="target"
        position={Position.Right}
        className="size-3! border-2! border-background!"
      />

      <Handle
        id="source-2"
        type="source"
        position={Position.Left}
        className="size-3! border-2! border-background!"
        style={{ top: "70%" }}
      />
      <Handle
        id="target-2"
        type="target"
        position={Position.Right}
        className="size-3! border-2! border-background!"
        style={{ top: "70%" }}
      />
    </>
  );
};
