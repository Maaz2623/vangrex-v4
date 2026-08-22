"use client";

import { AgentConfig, AgentFlowNode } from "../types/agent-node";

import { AppFlowNode } from "../node-config";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface AgentSettingsProps {
  node: AgentFlowNode;

  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
}

export const AgentSettings = ({ node, updateNode }: AgentSettingsProps) => {
  const config = node.data.config;

  const updateConfig = (partial: Partial<AgentConfig>) => {
    updateNode(node.id, (current) => {
      const agent = current as AgentFlowNode;

      const nextConfig: AgentConfig = {
        ...agent.data.config,
        ...partial,
      };

      return {
        ...agent,
        data: {
          ...agent.data,
          config: nextConfig,
        },
      };
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
                const agent = current as AgentFlowNode;

                return {
                  ...agent,
                  data: {
                    ...agent.data,
                    title: e.target.value,
                  },
                };
              });
            }}
            className="w-1/2"
          />
        </CardTitle>

        <CardDescription>Configure this AI agent.</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="general" className="h-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent">
            <TabsTrigger value="general">General</TabsTrigger>

            <TabsTrigger value="input">Input</TabsTrigger>

            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* ---------------- GENERAL ---------------- */}

          <TabsContent value="general" className="mt-0 space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="agent-model">Model</Label>

              <Select
                value={config.model}
                onValueChange={(value) =>
                  updateConfig({
                    model: value,
                  })
                }
              >
                <SelectTrigger id="agent-model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Gemini 2.5 Flash">
                    Gemini 2.5 Flash
                  </SelectItem>

                  <SelectItem value="Gemini 2.5 Pro">Gemini 2.5 Pro</SelectItem>

                  <SelectItem value="GPT-4.1">GPT-4.1</SelectItem>

                  <SelectItem value="GPT-4.1-mini">GPT-4.1 Mini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-prompt">System Prompt</Label>

              <Textarea
                id="agent-prompt"
                value={config.prompt}
                rows={8}
                placeholder="Describe what this agent should do..."
                onChange={(e) =>
                  updateConfig({
                    prompt: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-temperature">Temperature</Label>

              <Input
                id="agent-temperature"
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={config.temperature}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  updateConfig({
                    temperature: Number.isNaN(value) ? 0.7 : value,
                  });
                }}
              />

              <p className="text-sm text-muted-foreground">
                Lower values produce more deterministic responses.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-max-tokens">Maximum Tokens</Label>

              <Input
                id="agent-max-tokens"
                type="number"
                min={1}
                step={1}
                value={config.maxTokens}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  updateConfig({
                    maxTokens: Number.isNaN(value) ? 4096 : value,
                  });
                }}
              />
            </div>
          </TabsContent>

          {/* ---------------- INPUT ---------------- */}

          <TabsContent value="input" className="mt-0 space-y-6 p-6">
            <div className="rounded-lg border bg-muted/40 p-4">
              <h4 className="font-medium">Agent Input</h4>

              <p className="mt-2 text-sm text-muted-foreground">
                This agent receives its input from connected workflow nodes.
                Input mapping and schema configuration will be available here.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-input-variable">Input Variable</Label>

              <Input
                id="agent-input-variable"
                placeholder="e.g. user_message"
              />

              <p className="text-sm text-muted-foreground">
                Optional variable containing the input passed to this agent.
              </p>
            </div>
          </TabsContent>

          {/* ---------------- ADVANCED ---------------- */}

          <TabsContent value="advanced" className="mt-0 space-y-6 p-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Disabled</Label>

                <p className="text-sm text-muted-foreground">
                  Prevent this agent from executing.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.disabled}
                onCheckedChange={(checked) => {
                  updateNode(node.id, (current) => {
                    const agent = current as AgentFlowNode;

                    return {
                      ...agent,
                      data: {
                        ...agent.data,
                        metadata: {
                          ...agent.data.metadata,
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
                    const agent = current as AgentFlowNode;

                    return {
                      ...agent,
                      data: {
                        ...agent.data,
                        metadata: {
                          ...agent.data.metadata,
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
                  Collapse the node preview on the canvas.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.collapsed}
                onCheckedChange={(checked) => {
                  updateNode(node.id, (current) => {
                    const agent = current as AgentFlowNode;

                    return {
                      ...agent,
                      data: {
                        ...agent.data,
                        metadata: {
                          ...agent.data.metadata,
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
