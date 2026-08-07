import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetNodes = (workflowId: string) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.nodes.listByWorkflow.queryOptions(
      {
        workflowId,
      },
      {
        enabled: !!workflowId,
      },
    ),
  );
};

export const useCreateNode = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.nodes.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Node created.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};

export const useUpdateNode = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.nodes.update.mutationOptions({
      onSuccess: () => {
        toast.success(`Node Updated.`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};

export const useDeleteNode = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.nodes.delete.mutationOptions({
      onSuccess: () => {
        toast.success(`Node Deleted.`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};
