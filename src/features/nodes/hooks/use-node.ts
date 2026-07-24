import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteNode = () => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  return useMutation(
    trpc.nodes.deleteNode.mutationOptions({
      onSuccess: (data) => {
        toast.success("Node Deleted.");
        queryClient.invalidateQueries(
          trpc.nodes.getNodes.queryOptions({
            projectId: data,
          }),
        );
      },
    }),
  );
};

export const useUpdateNodePosition = () => {
  const trpc = useTRPC();

  return useMutation(trpc.nodes.updatePosition.mutationOptions());
};

export const useGetNodes = (projectId: string) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.nodes.getNodes.queryOptions({
      projectId: projectId,
    }),
  );
};

export const useAddNode = (projectId: string) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  return useMutation(
    trpc.nodes.add.mutationOptions({
      onSuccess: () => {
        toast.success("Node Created.");
        queryClient.invalidateQueries(
          trpc.nodes.getNodes.queryOptions({
            projectId: projectId,
          }),
        );
      },
    }),
  );
};
