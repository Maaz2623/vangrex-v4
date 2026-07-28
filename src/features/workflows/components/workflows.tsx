"use client";

import { useGetWorkflows } from "../hooks/use-workflows";

type Props = {
  projectId: string;
};

export const Workflows = ({ projectId }: Props) => {
  const { data: workflows } = useGetWorkflows(projectId);

  return <div>{JSON.stringify(workflows)}</div>;
};
