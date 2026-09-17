import type { VangrexClient } from "./client.js";
import type { RunWorkflowResponse } from "./types.js";
import type { WorkflowMap } from "./workflow-types.js";

export interface RunWorkflowOptions {
  signal?: AbortSignal;
}

export class WorkflowsResource<TWorkflows extends WorkflowMap = WorkflowMap> {
  constructor(private readonly client: VangrexClient) {}

  async run<K extends keyof TWorkflows & string>(
    workflowId: K,
    input: TWorkflows[K]["input"],
    options: RunWorkflowOptions = {},
  ): Promise<RunWorkflowResponse> {
    if (!workflowId || typeof workflowId !== "string") {
      throw new Error("workflowId is required");
    }

    return this.client.post<RunWorkflowResponse>(
      `/api/v1/workflows/${workflowId}/executions`,
      {
        input,
      },
      {
        signal: options.signal,
      },
    );
  }
}
