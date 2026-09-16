import type { JSONSchema } from "@/types/json-schema";

import { validateSchema } from "@/lib/validation/validate-schema";

export function validateWorkflowOutput(
  schema: JSONSchema | null,
  output: unknown,
) {
  if (!schema) {
    return;
  }

  const result = validateSchema(schema, output);

  if (!result.valid) {
    throw new Error(
      `Workflow output validation failed: ${JSON.stringify(result.errors)}`,
    );
  }
}
