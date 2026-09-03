import { Eye, Copy } from "lucide-react";

import { InfoCard } from "../base/info-card";
import { Section } from "../base/section";
import { OutputNodeData } from "../types/output-node";

import { useExecutionStore } from "@/features/canvas/store/execution-store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface OutputNodePreviewProps {
  data: OutputNodeData;
  nodeId: string;
  sourceNodeId?: string;
}

export const OutputNodePreview = ({
  data,
  nodeId,
  sourceNodeId,
}: OutputNodePreviewProps) => {
  const output = useExecutionStore((state) =>
    sourceNodeId ? state.outputs[sourceNodeId] : undefined,
  );

  const renderOutput = () => {
    if (!output) {
      return {
        preview: "No output yet.",
        fullText: null,
      };
    }

    switch (output.type) {
      case "agent":
        return {
          preview:
            output.text.length > 180
              ? `${output.text.slice(0, 180)}…`
              : output.text,
          fullText: output.text,
        };

      case "output":
        return {
          preview:
            output.text.length > 180
              ? `${output.text.slice(0, 180)}…`
              : output.text,
          fullText: output.text,
        };

      case "sandbox":
        return {
          preview: `Sandbox created: ${output.sandboxId}`,
          fullText: `Sandbox ID: ${output.sandboxId}`,
        };

      case "tool":
        return {
          preview: JSON.stringify(output.value),
          fullText: JSON.stringify(output.value, null, 2),
        };

      case "knowledge":
        return {
          preview: `${output.documents.length} document(s) returned`,
          fullText: output.documents.join("\n\n"),
        };

      case "human":
        return {
          preview: JSON.stringify(output.value),
          fullText: JSON.stringify(output.value, null, 2),
        };

      case "github":
        return {
          preview: JSON.stringify(output.value),
          fullText: JSON.stringify(output.value, null, 2),
        };

      default:
        return {
          preview: "Unsupported output type.",
          fullText: null,
        };
    }
  };

  const { preview, fullText } = renderOutput();

  const copyOutput = async () => {
    if (!fullText) return;

    await navigator.clipboard.writeText(fullText);
  };

  return (
    <Section title="Output">
      <InfoCard className="min-h-20">
        <div className="space-y-3">
          <p className="line-clamp-4 whitespace-pre-wrap break-words text-sm text-muted-foreground">
            {preview}
          </p>

          {fullText && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="mr-2 size-3.5" />
                  View full output
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Output</DialogTitle>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto rounded-md border bg-muted/30 p-4">
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {fullText}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={copyOutput}>
                    <Copy className="mr-2 size-3.5" />
                    Copy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </InfoCard>
    </Section>
  );
};
