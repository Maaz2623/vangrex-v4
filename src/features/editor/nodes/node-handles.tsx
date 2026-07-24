import { Handle, Position } from "@xyflow/react";

export const NodeHandles = () => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="size-3! border-2! border-background!"
      />
      <Handle
        type="target"
        position={Position.Right}
        className="size-3! border-2! border-background!"
      />
    </>
  );
};
