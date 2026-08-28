"use client";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AppFlowNode } from "../node-config";
import { GithubConfig, GithubFlowNode } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GitHubSettingsProps {
  node: GithubFlowNode;

  updateNode: (
    nodeId: string,
    updater: (node: AppFlowNode) => AppFlowNode,
  ) => void;
  workflowId: string;
  projectId: string
}

export const GitHubSettings = ({
  node,
  updateNode,
  workflowId,
  projectId
}: GitHubSettingsProps) => {
  const config = node.data.config;

  const updateConfig = (partial: Partial<GithubConfig>) => {
    updateNode(node.id, (current) => {
      const github = current as GithubFlowNode;

      return {
        ...github,
        data: {
          ...github.data,
          config: {
            ...github.data.config,
            ...partial,
          },
        },
      };
    });
  };

  const updateOperation = (
    operation: keyof GithubConfig["operations"],
    enabled: boolean,
  ) => {
    updateConfig({
      operations: {
        ...config.operations,
        [operation]: enabled,
      },
    });
  };

  const updateRepository = (partial: Partial<GithubConfig["repository"]>) => {
    updateConfig({
      repository: {
        ...config.repository,
        ...partial,
      },
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
                const github = current as GithubFlowNode;

                return {
                  ...github,
                  data: {
                    ...github.data,
                    title: e.target.value,
                  },
                };
              });
            }}
            className="w-1/2"
          />
        </CardTitle>

        <CardDescription>Configure this GitHub integration.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        {/* Authentication */}

        <div className="space-y-3">
          <div>
            <Label>Authentication</Label>

            <p className="text-sm text-muted-foreground">
              Connect a GitHub account to this workflow.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">
                {config.connectionId
                  ? "GitHub connected"
                  : "GitHub not connected"}
              </p>

              <p className="text-sm text-muted-foreground">
                {config.connectionId
                  ? "This node has a GitHub connection."
                  : "Connect GitHub to perform repository operations."}
              </p>
            </div>

            <Button
              variant={`outline`}
              className="rounded-md border px-3 py-2 text-sm"
              onClick={() => {
                const params = new URLSearchParams({
                  workflowId,
                  nodeId: node.id,
                  projectId: projectId
                });
                window.location.href = `/api/github/connect?${params.toString()}`;
              }}
            >
              {config.connectionId ? "Change" : "Connect GitHub"}
            </Button>
          </div>
        </div>

        {/* Operations */}

        <fieldset
          disabled={config.connectionId === undefined}
          className={cn("", !config.connectionId && "text-muted-foreground")}
        >
          <div className="space-y-3">
            <div>
              <Label>Operations</Label>

              <p className="text-sm text-muted-foreground">
                Choose what this GitHub node is allowed to do.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Create repository</Label>
                  <p className="text-sm text-muted-foreground">
                    Create a new GitHub repository.
                  </p>
                </div>

                <Switch
                  checked={config.operations.createRepository}
                  onCheckedChange={(checked) =>
                    updateOperation("createRepository", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Push project</Label>
                  <p className="text-sm text-muted-foreground">
                    Push the workspace project to GitHub.
                  </p>
                </div>

                <Switch
                  checked={config.operations.push}
                  onCheckedChange={(checked) =>
                    updateOperation("push", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Commit changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Create Git commits in the workspace.
                  </p>
                </div>

                <Switch
                  checked={config.operations.commit}
                  onCheckedChange={(checked) =>
                    updateOperation("commit", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Create branch</Label>
                  <p className="text-sm text-muted-foreground">
                    Create a new Git branch.
                  </p>
                </div>

                <Switch
                  checked={config.operations.createBranch}
                  onCheckedChange={(checked) =>
                    updateOperation("createBranch", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Create pull request</Label>
                  <p className="text-sm text-muted-foreground">
                    Open a pull request on GitHub.
                  </p>
                </div>

                <Switch
                  checked={config.operations.createPullRequest}
                  onCheckedChange={(checked) =>
                    updateOperation("createPullRequest", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Create issue</Label>
                  <p className="text-sm text-muted-foreground">
                    Create GitHub issues.
                  </p>
                </div>

                <Switch
                  checked={config.operations.createIssue}
                  onCheckedChange={(checked) =>
                    updateOperation("createIssue", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Repository */}

          <div className="space-y-4">
            <div>
              <Label>Repository</Label>

              <p className="text-sm text-muted-foreground">
                Configure the repository used by this node.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github-repository-name">Repository name</Label>

              <Input
                id="github-repository-name"
                placeholder="my-project"
                value={config.repository.name}
                onChange={(e) =>
                  updateRepository({
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>

              <Select
                disabled={!config.connectionId}
                value={config.repository.visibility}
                onValueChange={(value) =>
                  updateRepository({
                    visibility: value as "public" | "private",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>

                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </fieldset>
      </CardContent>
    </Card>
  );
};
