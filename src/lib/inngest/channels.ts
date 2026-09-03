import { realtime, staticSchema } from "inngest";
import { NodeStatusType } from "@/features/canvas/components/nodes/types";
import { ExecutionOutput } from "@/features/canvas/services/execution/execution-output";

export const workflowChannel = realtime.channel({
  name: ({ executionId }: { executionId: string }) => `workflow:${executionId}`,

  topics: {
    nodeStatus: {
      schema: staticSchema<{
        executionId: string;
        nodeId: string;
        status: NodeStatusType;
      }>(),
    },

    nodeOutput: {
      schema: staticSchema<{
        executionId: string;
        nodeId: string;
        output: ExecutionOutput;
      }>(),
    },
  },
});
