import type { VangrexClient } from "./client.js";
import type { RunWorkflowResponse } from "./types.js";

export interface RunWorkflowOptions {
  signal?: AbortSignal;
}

export class WorkflowsResource {
  constructor(private readonly client: VangrexClient) {}

  async run(
    workflowId: string,
    input: unknown = {},
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
