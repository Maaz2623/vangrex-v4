import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { projectsRouter } from "../procedures/projects.procedures";
import { workflowsRouter } from "../procedures/workflows.procedures";
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  workflows: workflowsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
