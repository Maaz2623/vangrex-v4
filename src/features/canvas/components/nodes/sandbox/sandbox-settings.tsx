"use client";

import { useState } from "react";

import { AppFlowNode } from "../node-config";
import { SandboxConfig, SandboxFlowNode } from "../types/sandbox-node";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Plus, Trash2 } from "lucide-react";

import { useCreateCredential } from "@/features/credentials/hooks/use-credentials";

import { SandboxEditor } from "@/features/sandbox/components/sandbox-editor";
import { SandboxFileExplorer } from "@/features/sandbox/components/sandbox-file-explorer";
import { useExecutionStore } from "@/features/canvas/store/execution-store";
import { SandboxTerminal } from "@/features/sandbox/components/sandbox-terminal";
import { SandboxTerminalContainer } from "@/features/sandbox/components/sandbox-terminal-container";

interface SandboxSettingsProps {
  node: SandboxFlowNode;

  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
}

export const SandboxSettings = ({ node, updateNode }: SandboxSettingsProps) => {
  const [credentialValues, setCredentialValues] = useState<
    Record<string, string>
  >({});

  const sandboxId = useExecutionStore((state) => state.sandboxId);

  const config = node.data.config;

  const createCredential = useCreateCredential();

  const updateConfig = (partial: Partial<SandboxConfig>) => {
    updateNode(node.id, (current) => {
      const sandbox = current as SandboxFlowNode;

      const nextConfig: SandboxConfig = {
        ...sandbox.data.config,
        ...partial,
      };

      return {
        ...sandbox,
        data: {
          ...sandbox.data,
          config: nextConfig,
        },
      };
    });
  };

  const updateCredential = (
    index: number,
    partial: Partial<SandboxConfig["credentials"][number]>,
  ) => {
    updateConfig({
      credentials: config.credentials.map((credential, i) =>
        i === index
          ? {
              ...credential,
              ...partial,
            }
          : credential,
      ),
    });
  };

  const addCredential = () => {
    updateConfig({
      credentials: [
        ...config.credentials,
        {
          key: "",
          credentialId: "",
        },
      ],
    });
  };

  const removeCredential = (index: number) => {
    updateConfig({
      credentials: config.credentials.filter((_, i) => i !== index),
    });
  };

  return (
    <Card className="h-full rounded-none border-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <Input
            placeholder="Node Name"
            value={node.data.title}
            onChange={(e) => {
              updateNode(node.id, (current) => {
                const sandbox = current as SandboxFlowNode;

                return {
                  ...sandbox,
                  data: {
                    ...sandbox.data,
                    title: e.target.value,
                  },
                };
              });
            }}
            className="w-1/2"
          />
        </CardTitle>

        <CardDescription>Configure this sandbox environment.</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="general" className="h-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-transparent">
            <TabsTrigger value="general">General</TabsTrigger>

            <TabsTrigger value="files">Files</TabsTrigger>

            <TabsTrigger value="environment">Environment</TabsTrigger>

            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* ---------------- GENERAL ---------------- */}

          <TabsContent value="general" className="mt-0 space-y-6 p-6">
            <div className="rounded-lg border bg-muted/40 p-4">
              <h4 className="font-medium">Sandbox Runtime</h4>

              <p className="mt-2 text-sm text-muted-foreground">
                This sandbox provides an isolated execution environment for
                connected agents and tools.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Runtime</Label>

              <Input value="E2B" disabled />

              <p className="text-sm text-muted-foreground">
                The sandbox runtime used for workflow execution.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Sandbox Lifecycle</Label>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Create on workflow execution</p>

                    <p className="text-sm text-muted-foreground">
                      A sandbox is created when this node executes.
                    </p>
                  </div>

                  <Switch checked disabled />
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Sandbox</p>

                  <p className="text-sm text-muted-foreground">
                    {sandboxId
                      ? "A sandbox is currently available."
                      : "No sandbox has been created yet."}
                  </p>
                </div>

                <span className="text-xs text-muted-foreground">
                  {sandboxId ? "Active" : "Not created"}
                </span>
              </div>
            </div>
          </TabsContent>

          {/* ---------------- FILES ---------------- */}

          <TabsContent
            value="files"
            className="mt-0 h-[calc(100vh-180px)]  min-h-0"
          >
            {sandboxId ? (
              <div className="flex h-[80vh] min-h-0 flex-col">
                <div className="flex min-h-0 flex-1">
                  <SandboxFileExplorer sandboxId={sandboxId} />

                  <div className="min-w-0 flex-1">
                    <SandboxEditor sandboxId={sandboxId} />
                  </div>
                </div>

                <div className="h-64 shrink-0 border-t">
                  <SandboxTerminalContainer sandboxId={sandboxId} />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <div className="max-w-sm text-center">
                  <h3 className="font-medium">No sandbox running</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Execute the workflow to create a sandbox. Once the sandbox
                    is running, its files will appear here.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ---------------- ENVIRONMENT ---------------- */}

          <TabsContent value="environment" className="mt-0 space-y-6 p-6">
            <div>
              <h4 className="font-medium">Environment Variables</h4>

              <p className="mt-1 text-sm text-muted-foreground">
                These values will be injected into the sandbox environment when
                it is created.
              </p>
            </div>

            <div className="space-y-3">
              {config.credentials.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No environment variables configured.
                  </p>
                </div>
              ) : (
                config.credentials.map((credential, index) => (
                  <div
                    key={credential.credentialId || `new-${index}`}
                    className="space-y-3 rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Label>Variable {index + 1}</Label>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCredential(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* KEY */}

                    <div className="space-y-2">
                      <Label
                        htmlFor={`credential-key-${
                          credential.credentialId || index
                        }`}
                      >
                        Key
                      </Label>

                      <Input
                        id={`credential-key-${
                          credential.credentialId || index
                        }`}
                        value={credential.key}
                        placeholder="GITHUB_TOKEN"
                        onChange={(e) =>
                          updateCredential(index, {
                            key: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* VALUE */}

                    <div className="space-y-2">
                      <Label
                        htmlFor={`credential-value-${
                          credential.credentialId || index
                        }`}
                      >
                        Value
                      </Label>

                      <Input
                        id={`credential-value-${
                          credential.credentialId || index
                        }`}
                        type="password"
                        placeholder="Enter secret value"
                        value={credentialValues[credential.credentialId] ?? ""}
                        onChange={(e) => {
                          setCredentialValues((current) => ({
                            ...current,
                            [credential.credentialId]: e.target.value,
                          }));
                        }}
                      />
                    </div>

                    {/* SAVE */}

                    <Button
                      type="button"
                      className="w-full"
                      disabled={
                        createCredential.isPending ||
                        !credential.key.trim() ||
                        !credentialValues[credential.credentialId]?.trim()
                      }
                      onClick={async () => {
                        const value = credentialValues[credential.credentialId];

                        if (!value?.trim() || !credential.key.trim()) {
                          return;
                        }

                        try {
                          const created = await createCredential.mutateAsync({
                            name: credential.key,
                            value,
                          });

                          updateCredential(index, {
                            credentialId: created.id,
                          });

                          setCredentialValues((current) => {
                            const next = { ...current };

                            delete next[credential.credentialId];

                            return next;
                          });
                        } catch (error) {
                          console.error(
                            "[credentials] failed to create credential:",
                            error,
                          );
                        }
                      }}
                    >
                      {createCredential.isPending
                        ? "Saving..."
                        : "Save credential"}
                    </Button>
                  </div>
                ))
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addCredential}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add environment variable
              </Button>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm font-medium">Security</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Environment values are treated as secrets and should never be
                displayed in the node preview or execution logs.
              </p>
            </div>
          </TabsContent>

          {/* ---------------- ADVANCED ---------------- */}

          <TabsContent value="advanced" className="mt-0 space-y-6 p-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Disabled</Label>

                <p className="text-sm text-muted-foreground">
                  Prevent this sandbox from executing.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.disabled}
                onCheckedChange={(checked) => {
                  updateNode(node.id, (current) => {
                    const sandbox = current as SandboxFlowNode;

                    return {
                      ...sandbox,
                      data: {
                        ...sandbox.data,
                        metadata: {
                          ...sandbox.data.metadata,
                          disabled: checked,
                        },
                      },
                    };
                  });
                }}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Locked</Label>

                <p className="text-sm text-muted-foreground">
                  Prevent accidental changes to this node.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.locked}
                onCheckedChange={(checked) => {
                  updateNode(node.id, (current) => {
                    const sandbox = current as SandboxFlowNode;

                    return {
                      ...sandbox,
                      data: {
                        ...sandbox.data,
                        metadata: {
                          ...sandbox.data.metadata,
                          locked: checked,
                        },
                      },
                    };
                  });
                }}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Collapsed</Label>

                <p className="text-sm text-muted-foreground">
                  Collapse the sandbox preview on the canvas.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.collapsed}
                onCheckedChange={(checked) => {
                  updateNode(node.id, (current) => {
                    const sandbox = current as SandboxFlowNode;

                    return {
                      ...sandbox,
                      data: {
                        ...sandbox.data,
                        metadata: {
                          ...sandbox.data.metadata,
                          collapsed: checked,
                        },
                      },
                    };
                  });
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
