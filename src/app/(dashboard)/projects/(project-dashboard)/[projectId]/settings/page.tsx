"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  FolderKanban,
  Save,
  Trash2,
} from "lucide-react";

const SettingsPage = () => {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId as string;

  const [name, setName] = useState("My Project");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // TODO: connect your update project mutation here
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone.",
    );

    if (!confirmed) return;

    // TODO: connect your delete project mutation here
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
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Project settings
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage your project details and configuration.
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
                Basic information about this project.
              </p>
            </div>

            <div className="space-y-6 p-6">
              <div className="space-y-2">
                <label htmlFor="project-name" className="text-sm font-medium">
                  Project name
                </label>

                <input
                  id="project-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="My project"
                  className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <p className="text-xs text-muted-foreground">
                  This name will be visible throughout Vangrex.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="project-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe what this project is used for..."
                  rows={4}
                  className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <p className="text-xs text-muted-foreground">
                  A short description helps you identify the project later.
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

          {/* Project ID */}
          <section className="rounded-xl border bg-card shadow-sm">
            <div className="border-b px-6 py-5">
              <h2 className="font-semibold">Project information</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Identifiers used by Vangrex.
              </p>
            </div>

            <div className="divide-y">
              <div className="flex items-center justify-between gap-6 px-6 py-4">
                <div>
                  <p className="text-sm font-medium">Project ID</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The unique identifier for this project.
                  </p>
                </div>

                <code className="max-w-[50%] truncate rounded-md bg-muted px-2.5 py-1.5 font-mono text-xs">
                  {projectId}
                </code>
              </div>
            </div>
          </section>

          {/* Workflow defaults */}
          <section className="rounded-xl border bg-card shadow-sm">
            <div className="border-b px-6 py-5">
              <h2 className="font-semibold">Workflow defaults</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Default behavior for workflows created in this project.
              </p>
            </div>

            <div className="divide-y">
              <SettingToggle
                title="Enable workflow executions"
                description="Allow workflows in this project to be executed."
                defaultChecked
              />

              <SettingToggle
                title="Allow concurrent executions"
                description="Allow multiple executions of the same workflow to run at once."
                defaultChecked
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
                Destructive actions that cannot be easily undone.
              </p>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Delete project</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Permanently delete this project, including its workflows and
                  execution history.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-destructive/30 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete project
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
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);

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
        onClick={() => setChecked((value) => !value)}
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

export default SettingsPage;
