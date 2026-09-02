import { Handle, Position } from "@xyflow/react";

import { NodeHandle } from "../types/node-handle";

interface NodePortsProps {
  handles: NodeHandle[];
}

export const NodePorts = ({ handles }: NodePortsProps) => {
  return (
    <>
      {handles.map((handle) => (
        <HandleWithLabel key={handle.id} handle={handle} />
      ))}
    </>
  );
};

function HandleWithLabel({ handle }: { handle: NodeHandle }) {
  const isLeft = handle.position === Position.Left;
  const isRight = handle.position === Position.Right;
  const isTop = handle.position === Position.Top;
  const isBottom = handle.position === Position.Bottom;

  return (
    <>
      <Handle
        id={handle.id}
        type={handle.direction}
        position={handle.position}
        isConnectable
        className="
          !h-3
          !w-3
          !border-2
          !border-background
          !bg-muted-foreground
          transition-colors
          hover:!bg-primary
        "
      />

      <span
        className={[
          `
            pointer-events-none
            absolute
            z-10
            whitespace-nowrap
            rounded-md
            border
            bg-background/95
            px-1.5
            py-0.5
            text-[10px]
            font-medium
            leading-none
            text-muted-foreground
            shadow-sm
            backdrop-blur
          `,

          // LEFT
          isLeft
            ? `
              right-full
              top-1/2
              mr-2
              -translate-y-1/2
            `
            : "",

          // RIGHT
          isRight
            ? `
              left-full
              top-1/2
              ml-2
              -translate-y-1/2
            `
            : "",

          // TOP
          isTop
            ? `
              bottom-full
              left-1/2
              mb-2
              -translate-x-1/2
            `
            : "",

          // BOTTOM
          isBottom
            ? `
              left-1/2
              top-full
              mt-2
              -translate-x-1/2
            `
            : "",
        ].join(" ")}
      >
        {handle.name}
      </span>
    </>
  );
}
