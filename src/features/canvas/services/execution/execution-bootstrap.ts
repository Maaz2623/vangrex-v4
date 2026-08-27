import { startExecutionPersistence } from "./execution-persistance-listener";

let initialized = false;

export function initializeExecutionSystem() {
  if (initialized) return;

  initialized = true;

  startExecutionPersistence();
}
