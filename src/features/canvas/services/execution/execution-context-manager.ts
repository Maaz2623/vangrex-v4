import { ExecuteConfig } from "@neondatabase/serverless";
import { ExecutionContext } from "./execution-context";
import { ExecutionOutput } from "./execution-output";
import { ExecutionArtifact } from "./execution-artifact";

export class ExecutionContextManager {
  constructor(private readonly context: ExecutionContext) {}

  getOutput(nodeId: string): ExecutionOutput | undefined {
    return this.context.outputs[nodeId];
  }

  setOutput(nodeId: string, output: ExecutionOutput) {
    this.context.outputs[nodeId] = output;
  }

  getVariable<T = unknown>(name: string): T | undefined {
    return this.context.variables[name] as T | undefined;
  }

  setVariable(name: string, value: unknown) {
    this.context.variables[name] = value;
  }

  getMetadata<T = unknown>(key: string): T | undefined {
    return this.context.metadata[key] as T | undefined;
  }

  setMetadata(key: string, value: unknown) {
    this.context.metadata[key] = value;
  }

  addArtifact(artifact: ExecutionArtifact) {
    this.context.artifacts.push(artifact);
  }

  getArtifacts(nodeId?: string) {
    if (!nodeId) {
      return this.context.artifacts;
    }

    return this.context.artifacts.filter((a) => a.nodeId === nodeId);
  }
}
