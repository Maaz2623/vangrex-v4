import type { ErrorObject } from "ajv";

import { ajv } from "./ajv";
import type { JSONSchema } from "@/types/json-schema";

export interface SchemaValidationResult {
  valid: boolean;
  errors: ErrorObject[];
}

export function validateSchema(
  schema: JSONSchema,
  data: unknown,
): SchemaValidationResult {
  const validate = ajv.compile(schema);

  const valid = validate(data);

  return {
    valid: !!valid,
    errors: validate.errors ?? [],
  };
}
