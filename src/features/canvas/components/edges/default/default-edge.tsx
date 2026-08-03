import { EdgeProps } from "@xyflow/react";
import { BaseWorkflowEdge } from "../base/base-edge";
import { DefaultFlowEdge } from "../types/default-edge";

export const DefaultEdge = (props: EdgeProps<DefaultFlowEdge>) => {
  return <BaseWorkflowEdge {...props} />;
};
