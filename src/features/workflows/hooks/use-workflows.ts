import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateWorkflow = () => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Workflow created.");
        queryClient.invalidateQueries(
          trpc.workflows.getWorkflows.queryOptions({
            projectId: data.projectId,
          }),
        );
        router.push(`/projects/${data.projectId}/workflows/${data.workflowId}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};

export const useSuspenseWorkflows = (projectId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.workflows.getWorkflows.queryOptions({
      projectId: projectId,
    }),
  );
};

export const useDeleteWorkflow = () => {
  const trpc = useTRPC();

  const pathname = usePathname();

  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation(
    trpc.workflows.deleteWorkflow.mutationOptions({
      onSuccess: (data) => {
        toast.success(`${data.name} deleted.`);
        queryClient.invalidateQueries(
          trpc.workflows.getWorkflows.queryOptions({
            projectId: data.projectId,
          }),
        );
        if (pathname === `/projects/${data.projectId}/workflows/${data.id}`) {
          router.push(`/projects/${data.projectId}/workflows`);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};
