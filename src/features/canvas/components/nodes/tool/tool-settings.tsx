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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      const tool = current as ToolFlowNode;

      const nextConfig: ToolConfig = {
        ...tool.data.config,
        ...partial,
      };

      return {
        ...tool,
        data: {
          ...tool.data,
          title: current.data.title || "Tool",
          description: current.data.description || "",
          config: nextConfig,
        },
      };
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Tool</CardTitle>

        <CardDescription>
          Configure the tool available to your AI agent.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="general" className="h-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent">
            <TabsTrigger value="general">General</TabsTrigger>

            <TabsTrigger value="parameters">Parameters</TabsTrigger>

            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* ---------------- GENERAL ---------------- */}

          <TabsContent value="general" className="mt-0 space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="tool-name">Tool Name</Label>

              <Input
                id="tool-name"
                value={node.data.title ?? ""}
                placeholder="get_weather"
                onChange={(e) =>
                  updateConfig({
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tool-description">Description</Label>

              <Textarea
                id="tool-description"
                value={node.data.description ?? ""}
                placeholder="Gets the current weather for a city."
                rows={6}
                onChange={(e) =>
                  updateConfig({
                    description: e.target.value,
                  })
                }
              />

              <p className="text-sm text-muted-foreground">
                The AI uses this description to decide when this tool should be
                called.
              </p>
            </div>

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
                  <SelectValue placeholder="Select implementation" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={ToolImplementations.WEATHER}>
                    Weather
                  </SelectItem>
                  <SelectItem value={ToolImplementations.READ_FILE}>
                    Read File
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* ---------------- PARAMETERS ---------------- */}

          <TabsContent value="parameters" className="mt-0 space-y-6 p-6">
            <div>
              <h3 className="text-sm font-medium">Tool Parameters</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Define the information the AI must provide when calling this
                tool.
              </p>
            </div>

            {config.implementation === ToolImplementations.WEATHER && (
              <div className="space-y-4 rounded-lg border bg-muted/40 p-4">
                <div>
                  <h4 className="font-medium">Weather</h4>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Parameters required by the weather tool.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weather-city">City</Label>

                  <Input
                    id="weather-city"
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
            )}
          </TabsContent>

          {/* ---------------- ADVANCED ---------------- */}

          <TabsContent value="advanced" className="mt-0 space-y-6 p-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Disabled</Label>

                <p className="mt-1 text-sm text-muted-foreground">
                  Prevent this tool from being used by agents.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.disabled}
                onCheckedChange={(checked) => {
                  updateNode(node.id, (current) => {
                    if (current.type !== "tool-call") {
                      return current;
                    }

                    const tool = current as ToolFlowNode;

                    return {
                      ...tool,
                      data: {
                        ...tool.data,
                        metadata: {
                          ...tool.data.metadata,
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

                <p className="mt-1 text-sm text-muted-foreground">
                  Prevent accidental changes to this node.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.locked}
                onCheckedChange={(checked) => {
                  updateNode(node.id, (current) => {
                    if (current.type !== "tool-call") {
                      return current;
                    }

                    const tool = current as ToolFlowNode;

                    return {
                      ...tool,
                      data: {
                        ...tool.data,
                        metadata: {
                          ...tool.data.metadata,
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

                <p className="mt-1 text-sm text-muted-foreground">
                  Collapse the tool preview on the canvas.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.collapsed}
                onCheckedChange={(checked) => {
                  updateNode(node.id, (current) => {
                    if (current.type !== "tool-call") {
                      return current;
                    }

                    const tool = current as ToolFlowNode;

                    return {
                      ...tool,
                      data: {
                        ...tool.data,
                        metadata: {
                          ...tool.data.metadata,
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
