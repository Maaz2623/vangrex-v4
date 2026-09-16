import type { JSONSchema } from "@/types/json-schema";

import { validateSchema } from "@/lib/validation/validate-schema";

export function validateWorkflowInput(
  schema: JSONSchema | null,
  input: unknown,
) {
  if (!schema) {
    return;
  }

  const result = validateSchema(schema, input);

  if (!result.valid) {
    throw new Error(
      `Workflow input validation failed: ${JSON.stringify(result.errors)}`,
    );
  }
}
