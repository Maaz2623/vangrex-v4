import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateProject = () => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Project Created.");
        queryClient.invalidateQueries(trpc.projects.getProjects.queryOptions());
        router.push(`/dashboard/projects/${data}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};
