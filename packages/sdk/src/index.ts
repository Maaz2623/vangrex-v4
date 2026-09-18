import { VangrexClient } from "./client.js";
import { ExecutionsResource } from "./executions.js";
import { WorkflowsResource } from "./workflows.js";
import type { WorkflowMap } from "./workflow-types.js";

export class Vangrex<TWorkflows extends WorkflowMap = WorkflowMap> {
  public readonly workflows: WorkflowsResource<TWorkflows>;
  public readonly executions: ExecutionsResource;

  constructor(options: { apiKey: string; baseUrl?: string }) {
    const client = new VangrexClient(options);

    this.workflows = new WorkflowsResource<TWorkflows>(client);
    this.executions = new ExecutionsResource(client);
  }
}

export { VangrexClient } from "./client.js";
export { VangrexError } from "./errors.js";

export type { VangrexClientOptions } from "./client.js";

export type {
  Execution,
  ExecutionEvent,
  ExecutionEventData,
  ExecutionEventType,
  RunWorkflowResponse,
} from "./types.js";

export type {
  JSONSchema,
  JSONSchemaType,
  JSONSchemaToType,
  WorkflowDefinition,
  WorkflowMap,
} from "./workflow-types.js";

export type { WorkflowInput, VangrexWorkflows } from "./workflow-contract.js";

export const VERSION = "0.1.2";
