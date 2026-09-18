import type { JSONSchema } from "./workflow-types.js";

import {
  generateWorkflowTypes,
  type VangrexWorkflowSchema,
} from "./generate-workflow-types.js";

export interface GenerateWorkflowTypesOptions {
  apiKey: string;
}

interface WorkflowApiResponse {
  workflows: Array<{
    id: string;
    name?: string | null;
    inputSchema?: JSONSchema | null;
  }>;
}

/**
 * Fetch all workflows available to the API key and generate
 * the TypeScript workflow contract.
 */
export async function fetchWorkflowTypes(
  options: GenerateWorkflowTypesOptions,
): Promise<string> {
  if (!options.apiKey) {
    throw new Error("Vangrex API key is required");
  }

  const baseUrl = "https://vangrex.vercel.app";

  const response = await fetch(`${baseUrl}/api/v1/workflows`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let message = `Failed to fetch Vangrex workflows (${response.status})`;

    try {
      const body = (await response.json()) as {
        error?: unknown;
        message?: unknown;
      };

      if (typeof body.error === "string") {
        message = body.error;
      } else if (typeof body.message === "string") {
        message = body.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  const data = (await response.json()) as WorkflowApiResponse;

  if (!data || !Array.isArray(data.workflows)) {
    throw new Error("Invalid response from Vangrex workflow API");
  }

  const workflows: VangrexWorkflowSchema[] = data.workflows.map((workflow) => ({
    id: workflow.id,
    name: workflow.name ?? null,
    inputSchema: workflow.inputSchema ?? null,
  }));

  return generateWorkflowTypes(workflows);
}
