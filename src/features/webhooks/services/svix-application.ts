import { svix } from "@/lib/svix";

export async function createSvixApplication(params: {
  projectId: string;
  projectName: string;
}) {
  return svix.application.create({
    name: params.projectName,
    uid: `vangrex-project-${params.projectId}`,
  });
}
