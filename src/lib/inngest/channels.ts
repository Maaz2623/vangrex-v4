import { realtime, staticSchema } from "inngest";
import { NodeStatusType } from "@/features/canvas/components/nodes/types";

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
  },
});
