import { Brain } from "lucide-react";

import { InfoCard } from "../base/info-card";
import { InfoRow } from "../base/info-row";
import { Section } from "../base/section";
import { FunctionNodeData } from "../types";

interface FunctionNodePreviewProps {
  data: FunctionNodeData;
}

export const FunctionNodePreview = ({ data }: FunctionNodePreviewProps) => {
  const { language, runtime, code } = data.config;

  return (
    <>
      <Section title="Model">
        <InfoCard className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />

          <span className="truncate text-sm font-medium">{language}</span>
        </InfoCard>
      </Section>

      <Section title="Prompt">
        <InfoCard>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {runtime}
          </p>
        </InfoCard>
      </Section>

      <Section title="Configuration">
        <InfoCard className="space-y-2">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {32} lines of code
          </p>
        </InfoCard>
      </Section>
    </>
  );
};
