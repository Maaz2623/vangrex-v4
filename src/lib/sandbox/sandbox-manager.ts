import { getCredential } from "@/features/credentials/services/credential-service";
import Sandbox from "e2b";

export interface SandboxInstance {
  id: string;
  sandbox: Sandbox;
}

export interface SandboxCredential {
  key: string;
  credentialId: string;
}

export interface SandboxManager {
  create(
    userId: string,
    credentials?: SandboxCredential[],
  ): Promise<SandboxInstance>;
  setEnv(sandbox: SandboxInstance, env: Record<string, string>): Promise<void>;
  getUrl(sandbox: SandboxInstance, port: number): string;
  kill(sandbox: SandboxInstance): Promise<void>;
  get(id: string): Promise<SandboxInstance>;
}

class E2BSandboxManager implements SandboxManager {
  async create(
    userId: string,
    credentials: SandboxCredential[],
  ): Promise<SandboxInstance> {
    const envs: Record<string, string> = {};

    for (const credential of credentials) {
      if (!credential.key || !credential.credentialId) {
        continue;
      }

      const storedCredential = await getCredential(
        userId,
        credential.credentialId,
      );

      if (!storedCredential) {
        throw new Error(`Credential not found: ${credential.credentialId}`);
      }

      envs[credential.key] = storedCredential.value;
    }

    console.log("[sandbox] env keys:", Object.keys(envs));

    const sandbox = await Sandbox.create({
      envs: {
        ...envs,
      },
    });

    console.log("[sandbox] created: ", sandbox.sandboxId);

    return {
      id: sandbox.sandboxId,
      sandbox,
    };
  }

  async setEnv(
    sandbox: SandboxInstance,
    env: Record<string, string>,
  ): Promise<void> {}

  async kill(sandbox: SandboxInstance): Promise<void> {
    await sandbox.sandbox.kill();

    console.log("[sandbox] killed: ", sandbox.id);
  }

  getUrl(sandbox: SandboxInstance, port: number): string {
    return sandbox.sandbox.getHost(port);
  }

  async get(id: string): Promise<SandboxInstance> {
    const sandbox = await Sandbox.connect(id);

    return { id, sandbox };
  }
}

export const sandboxManager = new E2BSandboxManager();
