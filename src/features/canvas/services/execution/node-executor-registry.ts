import { SandboxInstance } from "@/lib/sandbox/sandbox-manager";
import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import {
  AgentFlowNode,
  GithubFlowNode,
  OutputFlowNode,
} from "../../components/nodes/types";
import { VariableFlowNode } from "../../components/nodes/types/variable-node";
import { Workspace } from "../workspace/workspace-manager";
import { executeAgent } from "./agent-executor";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { executeOutput } from "./output-executor";
import { executeVariable } from "./variable-executor";
import { executeGithub } from "./github-executor";
import { executeSandbox } from "./sandbox-executor";
import { SandboxFlowNode } from "../../components/nodes/types/sandbox-node";

type Executor = (
  node: AppFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  context: ExecutionContext,
  userId: string,
) => Promise<void>;

export const nodeExecutorRegistry: Record<string, Executor> = {
  agent: (node, nodes, edges, context, userId) =>
    executeAgent(
      node as AgentFlowNode,
      nodes,
      edges,
      new ExecutionContextManager(context),
      userId,
    ),
  variable: (node, nodes, edges, context) =>
    executeVariable(
      node as unknown as VariableFlowNode,
      new ExecutionContextManager(context),
    ),

  output: (node, nodes, edges, context) =>
    executeOutput(
      node as OutputFlowNode,
      nodes,
      edges,
      new ExecutionContextManager(context),
    ),

  sandbox: (node, nodes, edges, context, userId) =>
    executeSandbox(
      node as SandboxFlowNode,
      nodes,
      edges,
      new ExecutionContextManager(context),
      userId,
    ),
};
