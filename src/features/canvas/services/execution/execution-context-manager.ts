import { ExecuteConfig } from "@neondatabase/serverless";
import { ExecutionContext } from "./execution-context";
import { ExecutionOutput } from "./execution-output";
import { ExecutionArtifact } from "./execution-artifact";
import { useExecutionStore } from "../../store/execution-store";

export class ExecutionContextManager {
  constructor(private readonly context: ExecutionContext) {}

  get executionId() {
    return this.context.executionId;
  }

  getContext(): ExecutionContext {
    return this.context;
  }

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

  startNode(nodeId: string) {
    const state = this.context.nodeStates[nodeId];

    state.status = "running";
    state.startedAt = Date.now();
  }

  finishNode(nodeId: string) {
    const state = this.context.nodeStates[nodeId];

    state.status = "success";
    state.completedAt = Date.now();

    if (state.startedAt) {
      state.duration = state.completedAt - state.startedAt;
    }
  }

  failNode(nodeId: string) {
    const state = this.context.nodeStates[nodeId];

    state.status = "error";
    state.completedAt = Date.now();

    if (state.startedAt) {
      state.duration = state.completedAt - state.startedAt;
    }
  }

  getNodeState(nodeId: string) {
    return this.context.nodeStates[nodeId];
  }

  incrementNodesExecuted() {
    this.context.stats.nodesExecuted++;
  }

  incrementAgentsExecuted() {
    this.context.stats.agentsExecuted++;
  }

  incrementToolsExecuted() {
    this.context.stats.toolsExecuted++;
  }

  recordAgentExecution() {
    this.incrementNodesExecuted();
    this.incrementAgentsExecuted();
  }

  recordToolExecution() {
    this.incrementNodesExecuted();
    this.incrementToolsExecuted();
  }

  incrementErrors() {
    this.context.stats.errors++;
  }

  finishExecution() {
    this.context.stats.completedAt = Date.now();

    this.context.stats.duration =
      this.context.stats.completedAt - this.context.stats.startedAt;
  }

  getStats() {
    return this.context.stats;
  }
}
