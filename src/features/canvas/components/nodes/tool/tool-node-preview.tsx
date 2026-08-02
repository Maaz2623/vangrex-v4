import { Wrench } from "lucide-react";

import { InfoCard } from "../base/info-card";
import { InfoRow } from "../base/info-row";
import { Section } from "../base/section";
import { ToolNodeData } from "../types/tool-node";

interface ToolNodePreviewProps {
  data: ToolNodeData;
}

export const ToolNodePreview = ({ data }: ToolNodePreviewProps) => {
  const { implementation } = data.config;

  return (
    <>
      <Section title="Tool">
        <InfoCard className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" />

          <span className="truncate text-sm font-medium">{data.title}</span>
        </InfoCard>
      </Section>

      <Section title="Description">
        <InfoCard>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {data.description || "No description provided."}
          </p>
        </InfoCard>
      </Section>

      <Section title="Implementation">
        <InfoCard>
          <InfoRow
            label="Function"
            value={implementation || "Not configured"}
          />
        </InfoCard>
      </Section>
    </>
  );
};
