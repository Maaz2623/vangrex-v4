import { FlowEdge } from "../../components/edges/types/base-edge";
import { AppFlowNode } from "../../components/nodes/node-config";
import { AgentFlowNode, OutputFlowNode } from "../../components/nodes/types";
import { VariableFlowNode } from "../../components/nodes/types/variable-node";
import { executeAgent } from "./agent-executor";
import { ExecutionContext } from "./execution-context";
import { ExecutionContextManager } from "./execution-context-manager";
import { executeOutput } from "./output-executor";
import { executeVariable } from "./variable-executor";

type Executor = (
  node: AppFlowNode,
  nodes: AppFlowNode[],
  edges: FlowEdge[],
  context: ExecutionContext,
) => Promise<void>;

export const nodeExecutorRegistry: Record<string, Executor> = {
  agent: (node, nodes, edges, context) =>
    executeAgent(
      node as AgentFlowNode,
      nodes,
      edges,
      new ExecutionContextManager(context),
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
};
