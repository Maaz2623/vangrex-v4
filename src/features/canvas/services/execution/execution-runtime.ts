

export interface ExecutionRuntime {
    runStep<T>(
        id: string,
        fn: () => Promise<T>
    ): Promise<T>
}