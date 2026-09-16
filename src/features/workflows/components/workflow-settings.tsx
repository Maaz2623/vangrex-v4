"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Save,
  Trash2,
  Workflow,
  Zap,
} from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { SchemaBuilder } from "./schema-builder";

import type { JSONSchema } from "@/types/json-schema";
import { useUpdateWorkflow } from "../hooks/use-workflows";

interface Props {
  projectId: string;
  workflowId: string;
}

const WorkflowSettings = ({ projectId, workflowId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();

  const { data: workflow } = useSuspenseQuery(
    trpc.workflows.getWorkflow.queryOptions({
      workflowId,
      projectId,
    }),
  );

  const updateWorkflowMutation = useUpdateWorkflow();

  /*
   * ------------------------------------------------------------
   * General
   * ------------------------------------------------------------
   */

  const [name, setName] = useState(workflow.name ?? "");
  const [description, setDescription] = useState(workflow.description ?? "");

  /*
   * ------------------------------------------------------------
   * Input schema
   * ------------------------------------------------------------
   */

  const [inputSchema, setInputSchema] = useState<JSONSchema | null>(
    workflow.inputSchema ?? null,
  );

  const [inputSchemaEnabled, setInputSchemaEnabled] = useState(
    Boolean(workflow.inputSchema),
  );

  /*
   * ------------------------------------------------------------
   * Execution
   *
   * These are currently local UI state because your current
   * updateWorkflow procedure doesn't expose these properties.
   * Add them to the DB/procedure when you want them persisted.
   * ------------------------------------------------------------
   */

  const [enabled, setEnabled] = useState(true);
  const [allowConcurrent, setAllowConcurrent] = useState(true);

  /*
   * ------------------------------------------------------------
   * General save
   * ------------------------------------------------------------
   */

  const handleSaveGeneral = () => {
    if (!name.trim()) {
      return;
    }

    updateWorkflowMutation.mutate({
      projectId,
      workflowId,
      name: name.trim(),
      description: description.trim(),
    });
  };

  /*
   * ------------------------------------------------------------
   * Input schema save
   *
   * SchemaBuilder calls this when:
   *
   * 1. User clicks Save changes
   * 2. User disables input validation
   * 3. User re-enables input validation
   *
   * null is intentionally passed to the mutation when disabled.
   * ------------------------------------------------------------
   */

  const handleSaveInputSchema = (schema: JSONSchema | null) => {
    setInputSchema(schema);

    updateWorkflowMutation.mutate({
      projectId,
      workflowId,
      inputSchema: schema,
    });
  };

  /*
   * ------------------------------------------------------------
   * Delete
   * ------------------------------------------------------------
   */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workflow? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    // TODO:
    // Connect your deleteWorkflow mutation here.
  };

  /*
   * ------------------------------------------------------------
   * Derived mutation state
   * ------------------------------------------------------------
   */

  const isSaving = updateWorkflowMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* ====================================================== */}
        {/* Header */}
        {/* ====================================================== */}

        <div className="mb-8">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-5 -ml-2 gap-2 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-card shadow-sm">
              <Workflow className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Workflow settings
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage this workflow&apos;s configuration and behavior.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* ==================================================== */}
          {/* General */}
          {/* ==================================================== */}

          <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="border-b px-6 py-5">
              <h2 className="font-semibold">General</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Basic information about this workflow.
              </p>
            </div>

            <div className="space-y-6 p-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="workflow-name" className="text-sm font-medium">
                  Workflow name
                </label>

                <input
                  id="workflow-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="My workflow"
                  className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <p className="text-xs text-muted-foreground">
                  The name displayed across your project.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="workflow-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="workflow-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe what this workflow does..."
                  rows={4}
                  className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <p className="text-xs text-muted-foreground">
                  A short description helps explain the purpose of this
                  workflow.
                </p>
              </div>
            </div>

            {/* General actions */}
            <div className="flex items-center justify-end border-t bg-muted/20 px-6 py-4">
              <Button
                type="button"
                onClick={handleSaveGeneral}
                disabled={isSaving || !name.trim()}
              >
                {isSaving ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </section>

          {/* ==================================================== */}
          {/* Input */}
          {/* ==================================================== */}

          <section>
            <div className="mb-5">
              <h2 className="text-base font-semibold">Input</h2>

              <p className="text-sm text-muted-foreground">
                Define the data your workflow accepts.
              </p>
            </div>

            <SchemaBuilder
              enabled={inputSchemaEnabled}
              schema={inputSchema}
              onEnabledChange={setInputSchemaEnabled}
              onSave={handleSaveInputSchema}
              isSaving={isSaving}
            />
          </section>

          {/* ==================================================== */}
          {/* Execution */}
          {/* ==================================================== */}

          <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="border-b px-6 py-5">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />

                <h2 className="font-semibold">Execution</h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Control how this workflow can be executed.
              </p>
            </div>

            <div className="divide-y">
              <SettingToggle
                title="Enable workflow"
                description="Allow this workflow to be executed."
                checked={enabled}
                onChange={setEnabled}
              />

              <SettingToggle
                title="Allow concurrent executions"
                description="Allow multiple executions of this workflow to run at the same time."
                checked={allowConcurrent}
                onChange={setAllowConcurrent}
              />
            </div>
          </section>

          {/* ==================================================== */}
          {/* Workflow information */}
          {/* ==================================================== */}

          <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="border-b px-6 py-5">
              <h2 className="font-semibold">Workflow information</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Identifiers used by Vangrex.
              </p>
            </div>

            <div className="divide-y">
              <InfoRow
                label="Workflow ID"
                description="The unique identifier for this workflow."
                value={workflowId}
              />

              <InfoRow
                label="Project ID"
                description="The project this workflow belongs to."
                value={projectId}
              />
            </div>
          </section>

          {/* ==================================================== */}
          {/* Danger zone */}
          {/* ==================================================== */}

          <section className="overflow-hidden rounded-xl border border-destructive/30 bg-card shadow-sm">
            <div className="border-b border-destructive/20 px-6 py-5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />

                <h2 className="font-semibold text-destructive">Danger zone</h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Destructive actions for this workflow.
              </p>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Delete workflow</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Permanently delete this workflow and its configuration.
                  Execution history may also be removed depending on your
                  retention policy.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete workflow
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
 * Setting Toggle
 * ================================================================ */

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
    <div className="flex items-center justify-between gap-6 px-6 py-5">
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

/* ================================================================
 * Info Row
 * ================================================================ */

const InfoRow = ({
  label,
  description,
  value,
}: {
  label: string;
  description: string;
  value: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <code className="max-w-[50%] truncate rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs">
        {value}
      </code>
    </div>
  );
};

export default WorkflowSettings;
