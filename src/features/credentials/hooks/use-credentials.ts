import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCredential = (credentialId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.credentials.get.queryOptions({ credentialId }));
};

export const useCreateCredential = () => {
  const trpc = useTRPC();

  return useMutation(trpc.credentials.create.mutationOptions());
};

export const useDeleteCredential = () => {
  const trpc = useTRPC();

  return useMutation(trpc.credentials.delete.mutationOptions());
};

export const useCredentials = () => {
  const trpc = useTRPC();

  return useQuery(trpc.credentials.list.queryOptions());
};
