import { caller, trpc } from "@/trpc/server";

export default async function TestPage() {
  const result = await caller.apiKeys.create({
    projectId: "a9ffe8c9-1dda-4753-a9fe-41a1edf5bedb",
    name: "AI Automation",
  });

  console.log(result.key);

  return <pre>{result.key}</pre>;
}
