import { ExecutionRuntime } from "@/features/canvas/services/execution/execution-runtime";

export class InngestExecutionRuntime implements ExecutionRuntime {
  constructor(
    private readonly step: {
      run: <T>(id: string, fn: () => Promise<T>) => Promise<unknown>;

      realtime: {
        publish: <TData>(id: string, topic: any, data: TData) => Promise<TData>;
      };
    },
  ) {}

  async runStep<T>(id: string, fn: () => Promise<T>): Promise<T> {
    return (await this.step.run(id, fn)) as T;
  }

  async publish<TTopic, TData>(
    id: string,
    topic: TTopic,
    data: TData,
  ): Promise<TData> {
    return this.step.realtime.publish(id, topic, data);
  }
}
