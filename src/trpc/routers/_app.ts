import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { projectsRouter } from "../procedures/projects.procedures";
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
