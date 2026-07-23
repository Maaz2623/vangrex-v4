"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCreateProject } from "../hooks/use-projects";

export function CreateProject() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const trpc = useTRPC();

  const router = useRouter();

  const createProject = useCreateProject();

  return (
    <fieldset disabled={createProject.isPending}>
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
              Create a new project to organize your code, workflows, and AI
              agents.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vangrex, Portfolio, AI CRM"
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
              disabled={createProject.isPending}
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              disabled={createProject.isPending}
              onClick={() =>
                createProject.mutate({
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
