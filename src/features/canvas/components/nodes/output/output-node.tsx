import { NodeProps, useEdges } from "@xyflow/react";

import { OutputFlowNode } from "../types";
import { NodeShell } from "../base/node-shell";
import { outputDefinition } from "./output-definition";
import { OutputNodePreview } from "./output-node-preview";
import { NodeToolbarButton } from "../base/node-toolbar-button";
import { Copy, Settings2, Trash2 } from "lucide-react";

export const OutputNode = ({
  id,
  data,
  selected,
}: NodeProps<OutputFlowNode>) => {
  const edges = useEdges();

  const inputEdge = edges.find(
    (edge) => edge.target === id && edge.targetHandle === "input",
  );

  return (
    <NodeShell
      definition={outputDefinition}
      data={data}
      selected={selected}
      preview={
        <OutputNodePreview
          nodeId={id}
          data={data}
          sourceNodeId={inputEdge?.source}
        />
      }
      toolbar={
        <>
          <NodeToolbarButton icon={Settings2} />
          <NodeToolbarButton icon={Copy} />
          <NodeToolbarButton icon={Trash2} />
        </>
      }
    />
  );
};
