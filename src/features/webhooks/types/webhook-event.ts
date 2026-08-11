export const WebhookEvents = {
  WORKFLOW_COMPLETED: "workflow.completed",
  WORKFLOW_FAILED: "workflow.failed",
} as const;

export type WebhookEventType =
  (typeof WebhookEvents)[keyof typeof WebhookEvents];

export interface WorkflowoCompletedPayload {
  executionId: string;
  workflowId: string;
  result: unknown;
  timestamp: string;
}

export interface WorkflowFailedPayload {
  executionId: string;
  workflowId: string;
  error: string;
  timestamp: string;
}
