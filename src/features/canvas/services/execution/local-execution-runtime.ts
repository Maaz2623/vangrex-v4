import { ExecutionRuntime } from "./execution-runtime";

export class LocalExecutionRuntime implements ExecutionRuntime {
  async runStep<T>(id: string, fn: () => Promise<T>): Promise<T> {
    return fn();
  }
}
