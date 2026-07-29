"use client";

import { useCreateWorkflow, useGetWorkflows } from "../hooks/use-workflows";
import { PageHeader } from "@/components/page-header";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  projectId: string;
};

export const Workflows = ({ projectId }: Props) => {
  const { data: workflows } = useGetWorkflows(projectId);

  return <div className="space-y-10">{JSON.stringify(workflows)}</div>;
};

export function CreateWorkflow({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const createWorkflow = useCreateWorkflow();

  return (
    <fieldset disabled={createWorkflow.isPending}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="h-4 w-4" />
            Create
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create</DialogTitle>
            <DialogDescription>
              Create a new workflow to start automating.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Automation Workflow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                placeholder="Briefly describe what this project is about..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={createWorkflow.isPending}
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              disabled={createWorkflow.isPending}
              onClick={() =>
                createWorkflow.mutate({
                  projectId: projectId,
                  name: name,
                  description: description,
                })
              }
            >
              <PlusIcon className="h-4 w-4" />
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </fieldset>
  );
}

export function SearchWorkflow() {
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search workflows..."
        className="pl-9 pr-10"
      />

      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          onClick={() => setValue("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
