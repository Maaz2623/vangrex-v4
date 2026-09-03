import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "@xyflow/react";

import { DefaultFlowEdge } from "../types/default-edge";

export const BaseWorkflowEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  animated,
  data,
  markerEnd,
}: EdgeProps<DefaultFlowEdge>) => {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const executionState = data?.metadata?.executionState;

  const isRunning = animated || executionState === "running";

  const isSuccess = executionState === "success";

  const isError = executionState === "error";

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        className={[
          "workflow-edge",
          isRunning && "workflow-edge-running",
          isSuccess && "workflow-edge-success",
          isError && "workflow-edge-error",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          strokeWidth: isRunning || isSuccess || isError ? 2 : 1.5,
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          className="pointer-events-none"
        />
      </EdgeLabelRenderer>
    </>
  );
};
