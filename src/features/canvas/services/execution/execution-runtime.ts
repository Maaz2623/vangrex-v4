export interface ExecutionRuntime {
  runStep<T>(id: string, fn: () => Promise<T>): Promise<T>;

  publish<TTopic, TData>(
    id: string,
    topic: TTopic,
    data: TData,
  ): Promise<TData>;
}
