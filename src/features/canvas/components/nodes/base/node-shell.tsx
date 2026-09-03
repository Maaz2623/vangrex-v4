import { ReactNode } from "react";

import { BaseNode } from "./base-node";
import { NodeHeader } from "./node-header";
import { NodeBody } from "./node-body";
import { NodeFooter } from "./node-footer";
import { NodeToolbar } from "./node-toolbar";

import { NodeDefinition } from "../types/node-definition";
import { BaseNodeData } from "../types/base-node";
import { NodeStatus } from "./node-status";
import { useNodeSettingsStore } from "@/features/canvas/store/node-settings-store";

interface NodeShellProps<TConfig extends Record<string, unknown>> {
  definition: NodeDefinition<TConfig>;

  data: BaseNodeData<TConfig>;

  selected?: boolean;

  preview: ReactNode;

  toolbar?: ReactNode;
}

export const NodeShell = <TConfig extends Record<string, unknown>>({
  definition,
  data,
  selected,
  preview,
  toolbar,
}: NodeShellProps<TConfig>) => {
  const Icon = definition.icon;

  return (
    <BaseNode
      status={data.metadata.status}
      definition={definition}
      selected={selected}
    >
      {toolbar && <NodeToolbar>{toolbar}</NodeToolbar>}

      <NodeHeader
        icon={<Icon className="h-5 w-5" />}
        title={data.title}
        subtitle={definition.name}
        rightSection={<NodeStatus status={data.metadata.status} />}
      />

      <NodeBody>{preview}</NodeBody>

      <NodeFooter />
    </BaseNode>
  );
};
