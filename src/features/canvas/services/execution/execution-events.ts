import { ExecutionEvent } from "./event-types";

type Listener = (event: ExecutionEvent) => void;

const listeners = new Set<Listener>();

export const executionEvents = {
  emit(event: ExecutionEvent) {
    listeners.forEach((listener) => listener(event));
  },

  subscribe(listener: Listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};
