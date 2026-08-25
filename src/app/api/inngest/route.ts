import { inngest } from "@/lib/inngest/client";
import { executeWorkflow } from "@/lib/inngest/functions/execute-workflow";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow],
});
