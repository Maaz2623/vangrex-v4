
import { FaGithub } from "react-icons/fa";
import { InfoCard } from "../base/info-card";
import { InfoRow } from "../base/info-row";
import { Section } from "../base/section";
import { GithubFlowNode } from "../types";


interface GitHubNodePreviewProps {
  data: GithubFlowNode["data"];
}

export const GitHubNodePreview = ({ data }: GitHubNodePreviewProps) => {
  const { operations, repository } = data.config;

  const enabledOperations = Object.entries(operations)
    .filter(([, enabled]) => enabled)
    .map(([operation]) => operation);

  return (
    <>
      <Section title="GitHub">
        <InfoCard className="flex items-center gap-2">
          <FaGithub className="h-4 w-4" />

          <span className="truncate text-sm font-medium">
            {data.config.connectionId ? "GitHub connected" : "Not connected"}
          </span>
        </InfoCard>
      </Section>

      <Section title="Repository">
        <InfoCard className="space-y-2">
          <InfoRow label="Name" value={repository.name || "Not configured"} />

          <InfoRow label="Visibility" value={repository.visibility} />
        </InfoCard>
      </Section>

      <Section title="Operations">
        <InfoCard>
          <p className="text-sm text-muted-foreground">
            {enabledOperations.length} enabled
          </p>
        </InfoCard>
      </Section>
    </>
  );
};
