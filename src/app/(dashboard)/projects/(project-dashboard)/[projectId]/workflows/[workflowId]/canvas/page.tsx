import { CanvasHeader } from "@/features/canvas/components/canvas-header";

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
      <CanvasHeader projectId={projectId} workflowId={workflowId} />
    </div>
  );
};

export default CanvasPage;
