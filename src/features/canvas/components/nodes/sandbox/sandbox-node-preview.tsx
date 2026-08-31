import {
  Box,
  CheckCircle2,
  CircleDot,
  Clock3,
  KeyRound,
  Server,
} from "lucide-react";

import { InfoCard } from "../base/info-card";
import { Section } from "../base/section";
import { SandboxNodeData } from "../types/sandbox-node";

interface SandboxNodePreviewProps {
  data: SandboxNodeData;
}

export const SandboxNodePreview = ({ data }: SandboxNodePreviewProps) => {
  const credentials = data.config.credentials;

  return (
    <div className="space-y-3">
      <Section title="Sandbox">
        <InfoCard className="space-y-3">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDot className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Status</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Running
            </div>
          </div>

          {/* Runtime */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Runtime</span>
            </div>

            <span className="text-sm text-muted-foreground">E2B</span>
          </div>

          {/* Sandbox ID */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sandbox</span>
            </div>

            <span className="max-w-32 truncate font-mono text-xs text-muted-foreground">
              Not created
            </span>
          </div>
        </InfoCard>
      </Section>

      <Section title="Environment">
        <InfoCard className="space-y-2">
          {credentials.length === 0 ? (
            <div className="flex items-center gap-2 py-1">
              <KeyRound className="h-4 w-4 text-muted-foreground" />

              <span className="text-sm text-muted-foreground">
                No environment variables
              </span>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Variables</span>

                <span className="text-xs text-muted-foreground">
                  {credentials.length}
                </span>
              </div>

              {credentials.map((credential) => (
                <div
                  key={credential.credentialId}
                  className="flex items-center justify-between rounded-md border bg-muted/30 px-2.5 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <KeyRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                    <span className="truncate font-mono text-xs">
                      {credential.key}
                    </span>
                  </div>

                  <span className="ml-2 text-xs tracking-widest text-muted-foreground">
                    ••••••••
                  </span>
                </div>
              ))}
            </>
          )}
        </InfoCard>
      </Section>

      <Section title="Runtime information">
        <InfoCard className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Lifecycle</span>

            <span className="text-xs">Persistent</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Created</span>

            <span className="text-xs text-muted-foreground">—</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Uptime</span>

            <span className="text-xs text-muted-foreground">—</span>
          </div>
        </InfoCard>
      </Section>
    </div>
  );
};
