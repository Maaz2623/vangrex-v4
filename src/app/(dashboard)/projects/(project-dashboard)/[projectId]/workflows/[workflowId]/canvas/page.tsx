import { CanvasEditor } from "@/features/canvas/components/canvas-editor";

interface Props {
  params: Promise<{
    projectId: string;
    workflowId: string;
  }>;
}

const CanvasPage = async ({ params }: Props) => {
  const { projectId, workflowId } = await params;

  return (
    <div className="w-full h-full">
      <CanvasEditor projectId={projectId} workflowId={workflowId} />
    </div>
  );
};

export default CanvasPage;
