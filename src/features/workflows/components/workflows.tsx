"use client";

import {
  useCreateWorkflow,
  useDeleteWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
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
import {
  BoxIcon,
  MoreVerticalIcon,
  PlusIcon,
  Search,
  TrashIcon,
  WorkflowIcon,
  X,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type Props = {
  projectId: string;
};

export const Workflows = ({ projectId }: Props) => {
  const { data: workflows } = useSuspenseWorkflows(projectId);

  if (workflows.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BoxIcon />
          </EmptyMedia>
          <EmptyTitle>No Workflows Yet</EmptyTitle>
          <EmptyDescription>
            You haven't created any workflows yet. Get started by creating your
            first workflow.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateWorkflow projectId={projectId} />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="space-y-10">
      {workflows.map((workflow) => {
        return (
          <WorkflowItem
            id={workflow.id}
            key={workflow.id}
            name={workflow.name}
            description={workflow.description || "No description"}
            createdAt={workflow.createdAt}
            updatedAt={workflow.updatedAt}
            projectId={workflow.projectId}
          />
        );
      })}
    </div>
  );
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

export const WorkflowItem = ({
  name,
  description,
  projectId,
  updatedAt,
  createdAt,
  id,
}: {
  id: string;
  name: string;
  description: string;
  projectId: string;
  updatedAt: Date;
  createdAt: Date;
}) => {
  const router = useRouter();

  return (
    <div className="flex border-card-foreground/10  border px-3 py-4 bg-card justify-between items-center w-full rounded-xl">
      <div
        onClick={() => router.push(`/projects/${projectId}/workflows/${id}`)}
        className="flex gap-x-3 items-center hover:cursor-pointer"
      >
        <WorkflowIcon className="mx-3" />
        <div className="flex flex-col ">
          <h4 className="text-lg">{name}</h4>
          <p className="text-muted-foreground text-sm">
            Created{" "}
            {formatDistanceToNow(createdAt, {
              addSuffix: true,
            })}{" "}
            &bull; Updated{" "}
            {formatDistanceToNow(updatedAt, {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
      <div>
        <OptionsModal workflowId={id} projectId={projectId}>
          <Button variant={`ghost`} className="z-50">
            <MoreVerticalIcon />
          </Button>
        </OptionsModal>
      </div>
    </div>
  );
};

const OptionsModal = ({
  workflowId,
  projectId,
  children,
}: {
  workflowId: string;
  projectId: string;
  children: React.ReactNode;
}) => {
  const deleteWorkflow = useDeleteWorkflow();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              deleteWorkflow.mutate({
                projectId: projectId,
                workflowId: workflowId,
              })
            }
            className="text-rose-600"
          >
            <TrashIcon className="mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
