export type JSONSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

export interface JSONSchema {
  type: JSONSchemaType;
  title?: string;
  description?: string;
  properties?: Record<string, JSONSchema>;
  required?: readonly string[];
  items?: JSONSchema;
  enum?: readonly unknown[];
  default?: unknown;
  additionalProperties?: boolean;
}

/**
 * Extract the required property names from an object schema.
 */
type RequiredKeys<T extends JSONSchema> = T extends {
  required: readonly (infer R)[];
}
  ? Extract<R, string>
  : never;

/**
 * Extract the optional property names from an object schema.
 */
type OptionalKeys<T extends JSONSchema> = T extends {
  properties: infer P extends Record<string, JSONSchema>;
}
  ? Exclude<keyof P, RequiredKeys<T>>
  : never;

/**
 * Extract the properties from an object schema.
 */
type ObjectProperties<T extends JSONSchema> = T extends {
  properties: infer P extends Record<string, JSONSchema>;
}
  ? P
  : never;

/**
 * Convert a JSON Schema definition into its TypeScript equivalent.
 */
type JSONSchemaValue<T extends JSONSchema> = T["type"] extends "string"
  ? string
  : T["type"] extends "number"
    ? number
    : T["type"] extends "integer"
      ? number
      : T["type"] extends "boolean"
        ? boolean
        : T["type"] extends "null"
          ? null
          : T["type"] extends "array"
            ? T extends {
                items: infer I extends JSONSchema;
              }
              ? JSONSchemaValue<I>[]
              : unknown[]
            : T["type"] extends "object"
              ? T extends {
                  properties: Record<string, JSONSchema>;
                }
                ? JSONSchemaObject<T>
                : Record<string, unknown>
              : unknown;

/**
 * Convert an object JSON Schema into a TypeScript object type.
 */
type JSONSchemaObject<T extends JSONSchema> = {
  [K in RequiredKeys<T>]: K extends keyof ObjectProperties<T>
    ? JSONSchemaValue<ObjectProperties<T>[K]>
    : never;
} & {
  [K in OptionalKeys<T>]?: K extends keyof ObjectProperties<T>
    ? JSONSchemaValue<ObjectProperties<T>[K]>
    : never;
};

/**
 * Public utility:
 *
 * JSON Schema → TypeScript
 */
export type JSONSchemaToType<T extends JSONSchema> = JSONSchemaValue<T>;

/**
 * A workflow definition.
 *
 * The input type is inferred from the workflow's schema.
 */
export interface WorkflowDefinition<
  TInputSchema extends JSONSchema = JSONSchema,
> {
  input: JSONSchemaToType<TInputSchema>;
}

/**
 * Collection of workflow definitions keyed by workflow ID.
 */
export type WorkflowMap = Record<string, WorkflowDefinition>;
