import { z } from "zod";

import { BaseNodeData } from "./base-node";
import { FlowNode } from "./flow-node";

export const sandboxCredentialSchema = z.object({
  key: z.string(),
  credentialId: z.string(),
});

export const sandboxConfigSchema = z.object({
  credentials: z.array(
    z.object({
      key: z.string(),
      credentialId: z.string(),
    }),
  ),
});

export type SandboxCredential = z.infer<typeof sandboxCredentialSchema>;

export type SandboxConfig = z.infer<typeof sandboxConfigSchema>;

export type SandboxNodeData = BaseNodeData<SandboxConfig>;

export type SandboxFlowNode = FlowNode<SandboxConfig, "sandbox">;
