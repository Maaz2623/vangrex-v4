"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetEdges = (workflowId: string) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.edges.listByWorkflow.queryOptions(
      {
        workflowId,
      },
      {
        enabled: !!workflowId,
      },
    ),
  );
};

export const useCreateEdge = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.edges.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Edge created");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};

export const useUpdateEdge = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.edges.update.mutationOptions({
      onSuccess: (data) => {
        toast.success("Edge updated.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};

export const useDeleteEdge = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.edges.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success("Edge deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};
