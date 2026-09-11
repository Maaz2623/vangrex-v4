"use client";

import { useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  KeyRoundIcon,
  MoreHorizontalIcon,
  PlusIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

interface ApiKeysProps {
  projectId: string;
}

export const ApiKeys = ({ projectId }: ApiKeysProps) => {
  const trpc = useTRPC();

  const { data: initialApiKeys } = useSuspenseQuery(
    trpc.apiKeys.get.queryOptions({
      projectId,
    }),
  );

  const [apiKeys, setApiKeys] = useState(initialApiKeys);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSecretOpen, setIsSecretOpen] = useState(false);

  const [name, setName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createApiKey = useMutation(
    trpc.apiKeys.create.mutationOptions({
      onSuccess: (data) => {
        setApiKeys((current) => [
          {
            id: data.id,
            name: data.name,
            keyPrefix: data.keyPrefix,
            createdAt: data.createdAt,
            lastUsedAt: null,
            revokedAt: null,
          },
          ...current,
        ]);

        setCreatedKey(data.key);

        setName("");
        setIsCreateOpen(false);
        setIsSecretOpen(true);
      },
    }),
  );

  const revokeApiKey = useMutation(
    trpc.apiKeys.revoke.mutationOptions({
      onSuccess: (_, variables) => {
        setApiKeys((current) =>
          current.map((apiKey) =>
            apiKey.id === variables.apiKeyId
              ? {
                  ...apiKey,
                  revokedAt: new Date(),
                }
              : apiKey,
          ),
        );
      },
    }),
  );

  const handleCreate = () => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    createApiKey.mutate({
      projectId,
      name: trimmedName,
    });
  };

  const handleRevoke = (apiKeyId: string) => {
    revokeApiKey.mutate({
      apiKeyId,
    });
  };

  const handleCopy = async () => {
    if (!createdKey) return;

    await navigator.clipboard.writeText(createdKey);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSecretDialogChange = (open: boolean) => {
    setIsSecretOpen(open);

    if (!open) {
      setCreatedKey(null);
      setCopied(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";

    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">API keys</h2>

          <p className="text-sm text-muted-foreground">
            Manage keys used to authenticate requests to your project.
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Create API key
        </Button>
      </div>

      {/* Security notice */}
      <div className="flex gap-3 rounded-lg border bg-muted/30 p-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
          <ShieldCheckIcon className="size-4 text-muted-foreground" />
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium">
            Keep your API keys secure
          </p>

          <p className="text-sm leading-relaxed text-muted-foreground">
            API keys provide access to your project. Store them securely and
            never expose them in client-side code or commit them to source
            control.
          </p>
        </div>
      </div>

      {/* API keys */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[64px] pr-4" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {apiKeys.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-48 text-center"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
                      <KeyRoundIcon className="size-5 text-muted-foreground" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        No API keys
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Create an API key to connect your application to
                        Vangrex.
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsCreateOpen(true)}
                    >
                      <PlusIcon className="mr-2 size-4" />
                      Create API key
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              apiKeys.map((apiKey) => {
                const isRevoked = Boolean(apiKey.revokedAt);

                return (
                  <TableRow key={apiKey.id}>
                    <TableCell className="pl-6 font-medium">
                      {apiKey.name}
                    </TableCell>

                    <TableCell>
                      <code className="font-mono text-xs text-muted-foreground">
                        {apiKey.keyPrefix}
                        <span className="tracking-widest">
                          ••••••••
                        </span>
                      </code>
                    </TableCell>

                    <TableCell>
                      {isRevoked ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          <span className="size-1.5 rounded-full bg-red-500" />
                          Revoked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(apiKey.lastUsedAt)}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(apiKey.createdAt)}
                    </TableCell>

                    <TableCell className="pr-4">
                      {!isRevoked && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={revokeApiKey.isPending}
                            >
                              <MoreHorizontalIcon className="size-4" />
                              <span className="sr-only">
                                API key actions
                              </span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              variant="destructive"
                              disabled={revokeApiKey.isPending}
                              onClick={() =>
                                handleRevoke(apiKey.id)
                              }
                            >
                              <Trash2Icon className="mr-2 size-4" />
                              Revoke
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create API key dialog */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);

          if (!open) {
            setName("");
            createApiKey.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>

            <DialogDescription>
              Give your API key a name to help you identify where it is
              being used.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="api-key-name">Name</Label>

            <Input
              id="api-key-name"
              placeholder="Production"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCreate();
                }
              }}
              autoFocus
              maxLength={255}
            />

            {createApiKey.error && (
              <p className="text-sm text-destructive">
                {createApiKey.error.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={createApiKey.isPending}
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreate}
              disabled={!name.trim() || createApiKey.isPending}
            >
              {createApiKey.isPending
                ? "Creating..."
                : "Create API key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* One-time secret dialog */}
      <Dialog
        open={isSecretOpen}
        onOpenChange={handleSecretDialogChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API key created</DialogTitle>

            <DialogDescription>
              Copy your API key now. For security, Vangrex will not show
              it again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <Label htmlFor="created-api-key">API key</Label>

            <div className="flex gap-2">
              <Input
                id="created-api-key"
                value={createdKey ?? ""}
                readOnly
                type="password"
                className="font-mono"
              />

              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!createdKey}
              >
                {copied ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}

                <span className="sr-only">
                  {copied ? "Copied" : "Copy API key"}
                </span>
              </Button>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Store this key in an environment variable such as{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">
                VANGREX_API_KEY
              </code>
              .
            </p>
          </div>

          <DialogFooter>
            <Button onClick={() => handleSecretDialogChange(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
