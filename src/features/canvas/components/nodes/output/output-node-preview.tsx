import { Monitor } from "lucide-react";

import { InfoCard } from "../base/info-card";
import { Section } from "../base/section";

import { OutputNodeData } from "../types/output-node";
import { useExecutionStore } from "@/features/canvas/store/execution-store";

interface OutputNodePreviewProps {
  data: OutputNodeData;
  nodeId: string;
}

export const OutputNodePreview = ({ data, nodeId }: OutputNodePreviewProps) => {
  const output = useExecutionStore((state) => state.outputs[nodeId]);

  return (
    <Section title="Output">
      <InfoCard className="min-h-20">
        <p className="whitespace-pre-wrap wrap-break-words text-sm text-muted-foreground">
          {!output
            ? "No output yet."
            : output.type === "output"
              ? output.text
              : "No output yet."}
        </p>
      </InfoCard>
    </Section>
  );
};
