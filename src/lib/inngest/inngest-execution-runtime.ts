import { ExecutionRuntime } from "@/features/canvas/services/execution/execution-runtime";

type InngestStep = {
  run<T>(id: string, fn: () => Promise<T>): Promise<T>;
};

export class InngestExecutionRuntime implements ExecutionRuntime {
  constructor(
    private readonly step: {
      run: <T>(id: string, fn: () => Promise<T>) => Promise<unknown>;
    },
  ) {}

  async runStep<T>(id: string, fn: () => Promise<T>): Promise<T> {
    return (await this.step.run(id, fn)) as T;
  }
}
