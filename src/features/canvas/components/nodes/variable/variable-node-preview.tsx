import { Braces } from "lucide-react";

import { InfoCard } from "../base/info-card";
import { InfoRow } from "../base/info-row";
import { Section } from "../base/section";
import { VariableNodeData } from "../types/variable-node";

interface VariableNodePreviewProps {
  data: VariableNodeData;
}

export const VariableNodePreview = ({ data }: VariableNodePreviewProps) => {
  const { name, value } = data.config;

  return (
    <>
      <Section title="Variable">
        <InfoCard className="flex items-center gap-2">
          <Braces className="h-4 w-4 text-primary" />

          <span className="truncate text-sm font-medium">
            {name || "Unnamed Variable"}
          </span>
        </InfoCard>
      </Section>

      <Section title="Value">
        <InfoCard>
          <InfoRow label="Value" value={value || "No value"} />
        </InfoCard>
      </Section>
    </>
  );
};
