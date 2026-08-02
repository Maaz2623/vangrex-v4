import { Handle } from "@xyflow/react";

import { NodeHandle } from "../types/node-handle";

interface NodePortsProps {
  handles: NodeHandle[];
}

export const NodePorts = ({ handles }: NodePortsProps) => {
  return (
    <>
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.direction}
          position={handle.position}
          isConnectable
          style={{
            width: 12,
            height: 12,
          }}
        />
      ))}
    </>
  );
};
