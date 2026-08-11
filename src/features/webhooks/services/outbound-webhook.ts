import { svix } from "@/lib/svix";
import {
  WebhookEvents,
  WorkflowFailedPayload,
  WorkflowoCompletedPayload,
} from "../types/webhook-event";

export async function sendWorkflowResult(params: {
  applicationId: string;
  executionId: string;
  workflowId: string;
  result: unknown;
}) {
  const payload: WorkflowoCompletedPayload = {
    executionId: params.executionId,
    workflowId: params.workflowId,
    result: params.result,
    timestamp: new Date().toISOString(),
  };

  await svix.message.create(params.applicationId, {
    eventType: WebhookEvents.WORKFLOW_COMPLETED,
    eventId: params.executionId,
    payload,
  });
}

export async function sendWorkflowFailure(params: {
  applicationId: string;
  executionId: string;
  workflowId: string;
  error: unknown;
}) {
  const payload: WorkflowFailedPayload = {
    executionId: params.executionId,
    workflowId: params.workflowId,
    error:
      params.error instanceof Error
        ? params.error.message
        : String(params.error),
    timestamp: new Date().toISOString(),
  };

  await svix.message.create(params.applicationId, {
    eventType: WebhookEvents.WORKFLOW_FAILED,
    eventId: params.executionId,
    payload,
  });
}
