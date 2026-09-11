import { VangrexClient } from "./client.js";
import { ExecutionsResource } from "./executions.js";
import { WorkflowsResource } from "./workflows.js";

export class Vangrex {
  public readonly workflows: WorkflowsResource;
  public readonly executions: ExecutionsResource;

  constructor(options: { apiKey: string; baseUrl?: string }) {
    const client = new VangrexClient(options);

    this.workflows = new WorkflowsResource(client);
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

export const VERSION = "0.1.0";
