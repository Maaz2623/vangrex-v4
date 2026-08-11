import { observable } from "@trpc/server/observable";
import { createTRPCRouter, protectedProcedure } from "../init";
import { executionEvents } from "@/features/canvas/services/execution/execution-events";

export const executionsRouter = createTRPCRouter({
  events: protectedProcedure.subscription(() => {
    return observable((emit) => {
      const unsubscribe = executionEvents.subscribe((evet) => {
        emit.next(event);
      });

      return unsubscribe;
    });
  }),
});
