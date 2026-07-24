"use client";

import { useEffect } from "react";

import {
  Background,
  Controls,
  ReactFlow,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AddNodeButton } from "@/features/editor/components/add-node-button";
import {
  useGetNodes,
  useUpdateNodePosition,
} from "@/features/nodes/hooks/use-node";

import { initialEdges } from "@/nodes/edges";

import { dbNodeToFlowNode } from "./flow-mappers";
import { nodeTypes } from "./node-types";
import { FlowNode } from "./types";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { BoxIcon, Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Canvas = ({ projectId }: { projectId: string }) => {
  const { data, isLoading } = useGetNodes(projectId);

  const updatePosition = useUpdateNodePosition();

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (!data) return;

    setNodes(data.map(dbNodeToFlowNode));
  }, [data, setNodes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (data && data.length === 0) {
  //   return (
  //     <Empty className="border w-[80]">
  //       <EmptyHeader>
  //         <EmptyMedia variant="icon">
  //           <BoxIcon />
  //         </EmptyMedia>
  //         <EmptyTitle>No data</EmptyTitle>
  //         <EmptyDescription>No data found</EmptyDescription>
  //       </EmptyHeader>
  //       <EmptyContent>
  //         <Button>Add data</Button>
  //       </EmptyContent>
  //     </Empty>
  //   );
  // }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={(_, node) => {
          updatePosition.mutate({
            id: node.id,
            positionX: node.position.x,
            positionY: node.position.y,
          });
        }}
        colorMode="dark"
        fitView
      >
        <AddNodeButton projectId={projectId} />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
