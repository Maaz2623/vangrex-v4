interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: Props) => {
  const { projectId } = await params;
  return <div className="w-full">Workflows</div>;
};

export default ProjectPage;
