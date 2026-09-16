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

  required?: string[];

  items?: JSONSchema;

  enum?: unknown[];

  default?: unknown;

  additionalProperties?: boolean;
}

export interface SchemaField {
  id: string;
  name: string;
  type: JSONSchemaType;
  description: string;
  required: boolean;
}
