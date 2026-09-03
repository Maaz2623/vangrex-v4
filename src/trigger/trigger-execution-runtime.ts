import { ExecutionRuntime } from "@/features/canvas/services/execution/execution-runtime";

export class TriggerExecutionRuntime implements ExecutionRuntime {
  async runStep<T>(_id: string, fn: () => Promise<T>): Promise<T> {
    return fn();
  }

  async publish<TTopic, TData>(
    _id: string,
    _topic: TTopic,
    data: TData,
  ): Promise<TData> {
    return data;
  }
}
