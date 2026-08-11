import { observable } from "@trpc/server/observable";
import { createTRPCRouter, protectedProcedure } from "../init";
import { executionEvents } from "@/features/canvas/services/execution/execution-events";
import { ExecutionEvent } from "@/features/canvas/services/execution/event-types";

export const executionsRouter = createTRPCRouter({
  events: protectedProcedure.subscription(() => {
    return observable<ExecutionEvent>((emit) => {
      const unsubscribe = executionEvents.subscribe((event) => {
        emit.next(event);
      });

      return unsubscribe;
    });
  }),
});
