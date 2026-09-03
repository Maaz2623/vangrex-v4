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
  const text = output?.type === "agent" ? output.text : null;
  console.log(text);

  const preview = text
    ? text.length > 180
      ? `${text.slice(0, 180)}…`
      : text
    : "No output yet.";

  const copyOutput = async () => {
    if (!text) return;

    await navigator.clipboard.writeText(text);
  };

  return (
    <Section title="Output">
      <InfoCard className="min-h-20">
        <div className="space-y-3">
          <p className="line-clamp-4 whitespace-pre-wrap break-words text-sm text-muted-foreground">
            {preview}
          </p>

          {text && (
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
                    {text}
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
