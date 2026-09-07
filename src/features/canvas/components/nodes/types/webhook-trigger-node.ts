import { FlowNode } from "./flow-node";

export interface WebhookTriggerConfig {
  path: string;
  method: "POST";
}

export type WebhookTriggerFlowNode = FlowNode<
  WebhookTriggerConfig,
  "webhook-trigger"
>;
