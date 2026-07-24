import { Canvas } from "@/features/editor/canvas/canvas";
import React from "react";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: Props) => {
  const { projectId } = await params;
  return (
    <div className="w-full">
      <Canvas projectId={projectId} />
    </div>
  );
};

export default ProjectPage;
