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
  style,
}: EdgeProps<DefaultFlowEdge>) => {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  console.log({
    id,
    animated,
    executionState: data?.metadata?.executionState,
  });

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          className="pointer-events-none"
        >
          {/* We'll add badges, execution state, etc. later */}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
