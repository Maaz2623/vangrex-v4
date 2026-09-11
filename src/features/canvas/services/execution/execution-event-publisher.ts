import { db } from "@/db";
import { executionEventsTable } from "@/db/schema";


import { ExecutionEventType, VangrexExecutionEvent } from "./execution-event";
import { executionEventStream } from "@/trigger/streams";

export async function publishExecutionEvent(params: {
  executionId: string;
  workflowId: string;
  type: ExecutionEventType;
  data: VangrexExecutionEvent["data"];
}) {
  const event: VangrexExecutionEvent = {
    id: crypto.randomUUID(),
    executionId: params.executionId,
    workflowId: params.workflowId,
    type: params.type,
    timestamp: new Date().toISOString(),
    data: params.data,
  };

  // Durable public event history
  await db.insert(executionEventsTable).values({
    id: event.id,
    executionId: event.executionId,
    workflowId: event.workflowId,
    type: event.type,
    data: event.data,
  });

  // Keep Trigger.dev stream for internal realtime consumers
  await executionEventStream.append(event);

  return event;
}
