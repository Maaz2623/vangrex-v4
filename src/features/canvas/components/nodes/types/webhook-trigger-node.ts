import { NodeConfig } from "../node-config";
import { FlowNode } from "./flow-node";

export interface WebhookTriggerConfig extends NodeConfig {
  path: string;
  method: "POST";
}

export type WebhookTriggerFlowNode = FlowNode<
  WebhookTriggerConfig,
  "webhook-trigger"
>;
