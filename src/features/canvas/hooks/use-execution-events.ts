import { useSubscription } from "@trpc/tanstack-react-query";
import { useEffect } from "react";
import { useExecutionStore } from "../store/execution-store";
import { useTRPC } from "@/trpc/client";

export function useExecutionEvents() {
  const trpc = useTRPC();

  const addEvent = useExecutionStore((state) => state.addEvent);

  const subscription = useSubscription(
    trpc.executions.events.subscriptionOptions(undefined, {
      onData: (event) => {
        addEvent(event);
      },

      onError: (error) => {
        console.error("❌ Execution event subscription failed:", error);
      },
    }),
  );

  useEffect(() => {
    return () => {
      subscription.reset();
    };
  }, [subscription]);

  return subscription;
}
