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

      return {
        ...agent,
        data: {
          ...agent.data,
          config: {
            ...agent.data.config,
            ...partial,
          },
        },
      };
    });
  };

  const updateMetadata = (
    key: "disabled" | "locked" | "collapsed",
    value: boolean,
  ) => {
    updateNode(node.id, (current) => {
      const agent = current as AgentFlowNode;

      return {
        ...agent,
        data: {
          ...agent.data,
          metadata: {
            ...agent.data.metadata,
            [key]: value,
          },
        },
      };
    });
  };

  const updateTitle = (title: string) => {
    updateNode(node.id, (current) => {
      const agent = current as AgentFlowNode;

      return {
        ...agent,
        data: {
          ...agent.data,
          title,
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
            onChange={(e) => updateTitle(e.target.value)}
            className="w-1/2"
          />
        </CardTitle>

        <CardDescription>Configure this AI agent.</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="general" className="h-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent">
            <TabsTrigger value="general">General</TabsTrigger>

            <TabsTrigger value="instructions">Instructions</TabsTrigger>

            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* ==================== GENERAL ==================== */}

          <TabsContent value="general" className="mt-0 space-y-6 p-6">
            {/* MODEL */}

            <div className="space-y-2">
              <Label htmlFor="agent-model">Model</Label>

              <Select
                value={config.model}
                onValueChange={(value) =>
                  updateConfig({
                    model: value as AgentConfig["model"],
                  })
                }
              >
                <SelectTrigger id="agent-model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="google/gemini-3.5-flash-lite">
                    Google · Gemini 3.5 Flash Lite
                  </SelectItem>

                  <SelectItem value="google/gemini-2.5-flash">
                    Google · Gemini 2.5 Flash
                  </SelectItem>

                  <SelectItem value="google/gemini-2.5-pro">
                    Google · Gemini 2.5 Pro
                  </SelectItem>

                  <SelectItem value="openai/gpt-5">OpenAI · GPT-5</SelectItem>

                  <SelectItem value="openai/gpt-5-mini">
                    OpenAI · GPT-5 Mini
                  </SelectItem>

                  <SelectItem value="anthropic/claude-sonnet-4.5">
                    Anthropic · Claude Sonnet 4.5
                  </SelectItem>

                  <SelectItem value="anthropic/claude-opus-4.1">
                    Anthropic · Claude Opus 4.1
                  </SelectItem>
                </SelectContent>
              </Select>

              <p className="text-sm text-muted-foreground">
                Select the model this agent will use for execution.
              </p>
            </div>

            {/* PROMPT */}

            <div className="space-y-2">
              <Label htmlFor="agent-prompt">Prompt</Label>

              <Textarea
                id="agent-prompt"
                value={config.prompt}
                rows={10}
                placeholder="Describe the task this agent should perform..."
                onChange={(e) =>
                  updateConfig({
                    prompt: e.target.value,
                  })
                }
              />

              <p className="text-sm text-muted-foreground">
                The task or request given to the agent during execution.
              </p>
            </div>
          </TabsContent>

          {/* ==================== INSTRUCTIONS ==================== */}

          <TabsContent value="instructions" className="mt-0 space-y-6 p-6">
            {/* INSTRUCTIONS */}

            <div className="space-y-2">
              <Label htmlFor="agent-instructions">Instructions</Label>

              <Textarea
                id="agent-instructions"
                value={config.instructions}
                rows={12}
                placeholder="Define how this agent should behave..."
                onChange={(e) =>
                  updateConfig({
                    instructions: e.target.value,
                  })
                }
              />

              <p className="text-sm text-muted-foreground">
                Define the agent's role, behavior, constraints, and how it
                should approach tasks.
              </p>
            </div>

            {/* REASONING */}

            <div className="space-y-2">
              <Label htmlFor="agent-reasoning">Reasoning</Label>

              <Select
                value={config.reasoning}
                onValueChange={(value) =>
                  updateConfig({
                    reasoning: value as AgentConfig["reasoning"],
                  })
                }
              >
                <SelectTrigger id="agent-reasoning">
                  <SelectValue placeholder="Select reasoning level" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">None</SelectItem>

                  <SelectItem value="low">Low</SelectItem>

                  <SelectItem value="medium">Medium</SelectItem>

                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-sm text-muted-foreground">
                Controls how much reasoning effort the model should use when
                processing the task.
              </p>
            </div>
          </TabsContent>

          {/* ==================== ADVANCED ==================== */}

          <TabsContent value="advanced" className="mt-0 space-y-4 p-6">
            {/* DISABLED */}

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label>Disabled</Label>

                <p className="text-sm text-muted-foreground">
                  Prevent this agent from executing.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.disabled}
                onCheckedChange={(checked) =>
                  updateMetadata("disabled", checked)
                }
              />
            </div>

            {/* LOCKED */}

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label>Locked</Label>

                <p className="text-sm text-muted-foreground">
                  Prevent accidental changes to this node.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.locked}
                onCheckedChange={(checked) => updateMetadata("locked", checked)}
              />
            </div>

            {/* COLLAPSED */}

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <Label>Collapsed</Label>

                <p className="text-sm text-muted-foreground">
                  Collapse the node preview on the canvas.
                </p>
              </div>

              <Switch
                checked={node.data.metadata.collapsed}
                onCheckedChange={(checked) =>
                  updateMetadata("collapsed", checked)
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
