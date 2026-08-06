"use client";

import {
  VariableConfig,
  VariableFlowNode,
  VariableType,
} from "../types/variable-node";

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

interface VariableSettingsProps {
  node: VariableFlowNode;

  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
}

export const VariableSettings = ({
  node,
  updateNode,
}: VariableSettingsProps) => {
  const config = node.data.config;

  const updateConfig = (partial: Partial<VariableConfig>) => {
    updateNode(node.id, (current) => {
      const variable = current as VariableFlowNode;

      const nextConfig: VariableConfig = {
        ...variable.data.config,
        ...partial,
      };

      return {
        ...variable,
        data: {
          ...variable.data,
          title: nextConfig.name || "Variable",
          config: nextConfig,
        },
      };
    });
  };

  return (
    <Card className="h-full rounded-none border-0 shadow-none">
      <CardHeader>
        <CardTitle>Variable</CardTitle>

        <CardDescription>Configure this workflow variable.</CardDescription>
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
              <Label htmlFor="variable-name">Variable Name</Label>

              <Input
                id="variable-name"
                value={config.name}
                onChange={(e) =>
                  updateConfig({
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Variable Type</Label>

              <Select
                value={config.type}
                onValueChange={(value: VariableType) =>
                  updateConfig({
                    type: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>

                  <SelectItem value="number">Number</SelectItem>

                  <SelectItem value="boolean">Boolean</SelectItem>

                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable-value">Default Value</Label>

              <Input
                id="variable-value"
                value={config.value}
                onChange={(e) =>
                  updateConfig({
                    value: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable-description">Description</Label>

              <Textarea
                id="variable-description"
                value={config.description}
                rows={4}
                onChange={(e) =>
                  updateConfig({
                    description: e.target.value,
                  })
                }
              />
            </div>
          </TabsContent>

          {/* ---------------- INPUT ---------------- */}

          <TabsContent value="input" className="mt-0 space-y-6 p-6">
            <div className="space-y-2">
              <Label>Accepted Type</Label>

              <Select
                value={config.type}
                onValueChange={(value: VariableType) =>
                  updateConfig({
                    type: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>

                  <SelectItem value="number">Number</SelectItem>

                  <SelectItem value="boolean">Boolean</SelectItem>

                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <h4 className="font-medium">Input Schema</h4>

              <p className="mt-2 text-sm text-muted-foreground">
                Schema configuration and validation rules will be available here
                in a future update.
              </p>
            </div>
          </TabsContent>

          {/* ---------------- ADVANCED ---------------- */}

          <TabsContent value="advanced" className="mt-0 space-y-6 p-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Secret</Label>

                <p className="text-sm text-muted-foreground">
                  Hide this variable's value during execution.
                </p>
              </div>

              <Switch
                checked={config.secret}
                onCheckedChange={(checked) =>
                  updateConfig({
                    secret: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Editable</Label>

                <p className="text-sm text-muted-foreground">
                  Allow users to modify this variable before execution.
                </p>
              </div>

              <Switch
                checked={config.editable}
                onCheckedChange={(checked) =>
                  updateConfig({
                    editable: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Global</Label>

                <p className="text-sm text-muted-foreground">
                  Make this variable available throughout the workflow.
                </p>
              </div>

              <Switch
                checked={config.global}
                onCheckedChange={(checked) =>
                  updateConfig({
                    global: checked,
                  })
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
