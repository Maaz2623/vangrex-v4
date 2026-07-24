import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { projectsRouter } from "../procedures/projects.procedures";
import { nodesRouter } from "../procedures/nodes.procedures";
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  nodes: nodesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
