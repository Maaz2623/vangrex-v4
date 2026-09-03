"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "./client";
import { workflowChannel } from "./channels";

export async function getWorkflowRealtimeToken(executionId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: workflowChannel({ executionId }),
    topics: ["nodeStatus"],
  });
}
