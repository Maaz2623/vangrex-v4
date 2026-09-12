"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  GitBranch,
  Save,
  Trash2,
  Workflow,
  Zap,
} from "lucide-react";

const WorkflowSettings = () => {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId as string;
  const workflowId = params.workflowId as string;

  const [name, setName] = useState("My Workflow");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [enabled, setEnabled] = useState(true);
  const [allowConcurrent, setAllowConcurrent] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // TODO: connect update workflow mutation
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workflow? This action cannot be undone.",
    );

    if (!confirmed) return;

    // TODO: connect delete workflow mutation
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

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
          {/* General */}
          <section className="rounded-xl border bg-card shadow-sm">
            <div className="border-b px-6 py-5">
              <h2 className="font-semibold">General</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Basic information about this workflow.
              </p>
            </div>

            <div className="space-y-6 p-6">
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

            <div className="flex items-center justify-end border-t bg-muted/20 px-6 py-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Execution */}
          <section className="rounded-xl border bg-card shadow-sm">
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

          {/* Workflow information */}
          <section className="rounded-xl border bg-card shadow-sm">
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

          {/* Danger zone */}
          <section className="rounded-xl border border-destructive/30 bg-card shadow-sm">
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

                <p className="mt-1 text-xs text-muted-foreground">
                  Permanently delete this workflow and its configuration.
                  Execution history may also be removed depending on your
                  retention policy.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-destructive/30 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete workflow
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
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
    <div className="flex items-center justify-between gap-6 px-6 py-5">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
};

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

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>

      <code className="max-w-[50%] truncate rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs">
        {value}
      </code>
    </div>
  );
};

export default WorkflowSettings;
