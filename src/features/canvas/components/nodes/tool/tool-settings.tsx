"use client";

import { AppFlowNode } from "../node-config";
import { ToolConfig, ToolFlowNode } from "../types/tool-node";
import { ToolImplementations } from "@/features/canvas/services/tools/tool-implementation";

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

interface ToolSettingsProps {
  node: ToolFlowNode;

  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
}

export const ToolSettings = ({ node, updateNode }: ToolSettingsProps) => {
  const config = node.data.config;

  const updateConfig = (partial: Partial<ToolConfig>) => {
    updateNode(node.id, (current) => {
      if (current.type !== "tool-call") {
        return current;
      }

      const nextConfig: ToolConfig = {
        ...current.data.config,
        ...partial,
      };

      return {
        ...current,
        data: {
          ...current.data,
          title: nextConfig.name || "Tool",
          description: nextConfig.description,
          config: nextConfig,
        },
      };
    });
  };

  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader>
        <CardTitle>Tool</CardTitle>

        <CardDescription>
          Configure the tool available to your AI agent.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* General */}

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">General</h3>

            <p className="text-sm text-muted-foreground">
              Define what this tool does and how the agent should use it.
            </p>
          </div>

          {/* Name */}

          <div className="space-y-2">
            <Label htmlFor="tool-name">Tool Name</Label>

            <Input
              id="tool-name"
              value={node.data.title}
              placeholder="get_weather"
              onChange={(e) =>
                updateConfig({
                  name: e.target.value,
                })
              }
            />
          </div>

          {/* Description */}

          <div className="space-y-2">
            <Label htmlFor="tool-description">Description</Label>

            <Textarea
              id="tool-description"
              value={node.data.description}
              placeholder="Gets the current weather for a city."
              rows={4}
              onChange={(e) =>
                updateConfig({
                  description: e.target.value,
                })
              }
            />

            <p className="text-xs text-muted-foreground">
              The AI uses this description to decide when the tool should be
              called.
            </p>
          </div>

          {/* Implementation */}

          <div className="space-y-2">
            <Label>Implementation</Label>

            <Select
              value={config.implementation}
              onValueChange={(value) =>
                updateConfig({
                  implementation: value as ToolConfig["implementation"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ToolImplementations.WEATHER}>
                  Weather
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Parameters */}

        <div className="space-y-4 border-t pt-6">
          <div>
            <h3 className="text-sm font-medium">Parameters</h3>

            <p className="text-sm text-muted-foreground">
              Define the information the AI must provide when calling this tool.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-medium">Weather parameters</p>

            <div className="mt-3 space-y-2">
              <Label>City</Label>

              <Input
                value={String(config.parameters?.city ?? "")}
                placeholder="Bangalore"
                onChange={(e) =>
                  updateConfig({
                    parameters: {
                      ...config.parameters,
                      city: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Advanced */}

        <div className="space-y-4 border-t pt-6">
          <div>
            <h3 className="text-sm font-medium">Advanced</h3>

            <p className="text-sm text-muted-foreground">
              Configure execution behavior.
            </p>
          </div>

          {/* Enabled */}

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Enabled</Label>

              <p className="text-sm text-muted-foreground">
                Allow agents to use this tool.
              </p>
            </div>

            <Switch
              checked={true}
              onCheckedChange={(checked) =>
                updateConfig({
                  enabled: checked,
                })
              }
            />
          </div>

          {/* Timeout */}

          <div className="space-y-2">
            <Label htmlFor="tool-timeout">Timeout (ms)</Label>

            <Input
              id="tool-timeout"
              type="number"
              value={30000}
              onChange={(e) =>
                updateConfig({
                  timeout: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Retry */}

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Retry on failure</Label>

              <p className="text-sm text-muted-foreground">
                Automatically retry failed tool executions.
              </p>
            </div>

            <Switch
              checked={false}
              onCheckedChange={(checked) =>
                updateConfig({
                  retry: checked,
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
