"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import type {
  JSONSchema,
  JSONSchemaType,
  SchemaField,
} from "@/types/json-schema";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SchemaBuilderProps {
  enabled: boolean;
  schema: JSONSchema | null;
  onEnabledChange: (enabled: boolean) => void;
  onSave: (schema: JSONSchema | null) => void;
  isSaving?: boolean;
}

const FIELD_TYPES: JSONSchemaType[] = [
  "string",
  "number",
  "integer",
  "boolean",
];

const schemaToFields = (schema: JSONSchema | null): SchemaField[] => {
  if (!schema?.properties) {
    return [];
  }

  return Object.entries(schema.properties).map(([name, property]) => ({
    id: `schema-${name}-${crypto.randomUUID()}`,
    name,
    type: property.type,
    description: property.description ?? "",
    required: schema.required?.includes(name) ?? false,
  }));
};

const fieldsToSchema = (fields: SchemaField[]): JSONSchema => {
  const properties: Record<string, JSONSchema> = {};
  const required: string[] = [];

  for (const field of fields) {
    const name = field.name.trim();

    if (!name) {
      continue;
    }

    properties[name] = {
      type: field.type,
      ...(field.description.trim()
        ? {
            description: field.description.trim(),
          }
        : {}),
    };

    if (field.required) {
      required.push(name);
    }
  }

  return {
    type: "object",
    properties,
    ...(required.length > 0
      ? {
          required,
        }
      : {}),
    additionalProperties: false,
  };
};

const SettingToggle = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-6 rounded-xl border bg-card px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  );
};

export const SchemaBuilder = ({
  enabled,
  schema,
  onEnabledChange,
  onSave,
  isSaving = false,
}: SchemaBuilderProps) => {
  const [fields, setFields] = useState<SchemaField[]>(() =>
    schemaToFields(schema),
  );

  const handleToggle = (checked: boolean) => {
    onEnabledChange(checked);

    if (!checked) {
      // Disable validation immediately.
      // Parent mutation receives inputSchema: null.
      onSave(null);

      // Keep local fields untouched.
      // Re-enabling restores the existing draft.
      return;
    }

    // Re-enable using the current local draft.
    const nextSchema = fieldsToSchema(fields);

    onSave(nextSchema);
  };

  const addField = () => {
    const newField: SchemaField = {
      id: crypto.randomUUID(),
      name: "",
      type: "string",
      description: "",
      required: false,
    };

    setFields((current) => [...current, newField]);
  };

  const updateField = (
    id: string,
    updates: Partial<Omit<SchemaField, "id">>,
  ) => {
    setFields((current) =>
      current.map((field) =>
        field.id === id
          ? {
              ...field,
              ...updates,
            }
          : field,
      ),
    );
  };

  const removeField = (id: string) => {
    setFields((current) => current.filter((field) => field.id !== id));
  };

  const handleSave = () => {
    if (!enabled) {
      onSave(null);
      return;
    }

    const nextSchema = fieldsToSchema(fields);

    onSave(nextSchema);
  };

  return (
    <div className="space-y-4">
      {/* Schema toggle */}
      <SettingToggle
        title="Enable input schema"
        description="Validate workflow inputs against the schema before execution."
        checked={enabled}
        onChange={handleToggle}
      />

      {/* Disabled state */}
      {!enabled && (
        <div className="rounded-xl border border-dashed bg-card px-6 py-8 text-center">
          <p className="text-sm font-medium">Input validation is disabled</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Enable the schema to define and validate workflow inputs.
          </p>
        </div>
      )}

      {/* Enabled state */}
      {enabled && (
        <div className="overflow-hidden rounded-xl border bg-card">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold">Input fields</h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Define the fields your workflow expects.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addField}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add field
            </Button>
          </div>

          {/* Fields */}
          <div className="divide-y">
            {fields.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-medium">No fields defined</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add a field to start building your input schema.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addField}
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add field
                </Button>
              </div>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="space-y-5 px-5 py-5">
                {/* Field header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 min-w-6 items-center justify-center rounded-md bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">
                      {index + 1}
                    </div>

                    <p className="text-sm font-medium">Field {index + 1}</p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(field.id)}
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove field ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Name + Type */}
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor={`field-name-${field.id}`}
                      className="text-xs font-medium"
                    >
                      Field name
                    </label>

                    <input
                      id={`field-name-${field.id}`}
                      type="text"
                      value={field.name}
                      onChange={(event) =>
                        updateField(field.id, {
                          name: event.target.value,
                        })
                      }
                      placeholder="e.g. name"
                      className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label
                      htmlFor={`field-type-${field.id}`}
                      className="text-xs font-medium"
                    >
                      Type
                    </label>

                    <select
                      id={`field-type-${field.id}`}
                      value={field.type}
                      onChange={(event) =>
                        updateField(field.id, {
                          type: event.target.value as JSONSchemaType,
                        })
                      }
                      className="flex h-10 w-full appearance-none rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      {FIELD_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label
                    htmlFor={`field-description-${field.id}`}
                    className="text-xs font-medium"
                  >
                    Description
                  </label>

                  <textarea
                    id={`field-description-${field.id}`}
                    value={field.description}
                    onChange={(event) =>
                      updateField(field.id, {
                        description: event.target.value,
                      })
                    }
                    placeholder="Describe this field..."
                    rows={3}
                    className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Required */}
                <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Required</p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      This field must be provided.
                    </p>
                  </div>

                  <Switch
                    checked={field.required}
                    onCheckedChange={(checked) =>
                      updateField(field.id, {
                        required: checked,
                      })
                    }
                    aria-label={`Required: ${
                      field.name || `Field ${index + 1}`
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between gap-4 border-t bg-muted/20 px-5 py-4">
            <p className="text-xs text-muted-foreground">
              Changes are saved when you click Save changes.
            </p>

            <div className="flex items-center gap-2">
              {fields.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addField}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add field
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
