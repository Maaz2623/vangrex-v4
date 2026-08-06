import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { projectsRouter } from "../procedures/projects.procedures";
import { workflowsRouter } from "../procedures/workflows.procedures";
import { nodesRouter } from "../procedures/nodes.procedures";
import { edgesRouter } from "../procedures/edges.procedures";
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  workflows: workflowsRouter,
  nodes: nodesRouter,
  edges: edgesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
