import { executionEventStream } from "@/trigger/streams";
import { ExecutionEventType, VangrexExecutionEvent } from "./execution-event";

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

  await executionEventStream.append(event);

  return event;
}
