import { Brain, BrainCircuit, MessageSquare } from "lucide-react";

import { InfoCard } from "../base/info-card";
import { InfoRow } from "../base/info-row";
import { Section } from "../base/section";
import { AgentNodeData } from "../types";

interface AgentNodePreviewProps {
  data: AgentNodeData;
}

export const AgentNodePreview = ({ data }: AgentNodePreviewProps) => {
  const { model, prompt, reasoning, instructions } = data.config;

  return (
    <>
      <Section title="Model">
        <InfoCard className="flex items-center gap-2">
          <Brain className="h-4 w-4 shrink-0 text-primary" />

          <span className="truncate text-sm font-medium">{model}</span>
        </InfoCard>
      </Section>

      <Section title="Prompt">
        <InfoCard>
          <div className="flex items-start gap-2">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <p className="line-clamp-3 text-sm text-muted-foreground">
              {prompt || "No prompt configured."}
            </p>
          </div>
        </InfoCard>
      </Section>

      <Section title="Instructions">
        <InfoCard>
          <div className="flex items-start gap-2">
            <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <p className="line-clamp-4 text-sm text-muted-foreground">
              {instructions || "No instructions configured."}
            </p>
          </div>
        </InfoCard>
      </Section>

      <Section title="Configuration">
        <InfoCard className="space-y-2">
          <InfoRow label="Reasoning" value={reasoning} />
        </InfoCard>
      </Section>
    </>
  );
};
