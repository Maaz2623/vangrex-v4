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

  // Filesystem
  listFiles(sandbox: SandboxInstance, path?: string): Promise<unknown>;

  readFile(sandbox: SandboxInstance, path: string): Promise<string>;

  writeFile(
    sandbox: SandboxInstance,
    path: string,
    content: string,
  ): Promise<void>;

  createDirectory(sandbox: SandboxInstance, path: string): Promise<void>;

  deletePath(sandbox: SandboxInstance, path: string): Promise<void>;

  renamePath(
    sandbox: SandboxInstance,
    oldPath: string,
    newPath: string,
  ): Promise<void>;
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

  async get(id: string): Promise<SandboxInstance> {
    const sandbox = await Sandbox.connect(id);

    return { id, sandbox };
  }

  async listFiles(sandbox: SandboxInstance, path = "/"): Promise<unknown> {
    return await sandbox.sandbox.files.list(path);
  }

  async readFile(sandbox: SandboxInstance, path: string): Promise<string> {
    const file = await sandbox.sandbox.files.read(path);

    return file;
  }

  async writeFile(
    sandbox: SandboxInstance,
    path: string,
    content: string,
  ): Promise<void> {
    await sandbox.sandbox.files.write(path, content);
  }

  async createDirectory(sandbox: SandboxInstance, path: string): Promise<void> {
    await sandbox.sandbox.files.makeDir(path);
  }

  async deletePath(sandbox: SandboxInstance, path: string): Promise<void> {
    await sandbox.sandbox.files.remove(path);
  }

  async renamePath(
    sandbox: SandboxInstance,
    oldPath: string,
    newPath: string,
  ): Promise<void> {
    await sandbox.sandbox.files.rename(oldPath, newPath);
  }

  getUrl(sandbox: SandboxInstance, port: number): string {
    return sandbox.sandbox.getHost(port);
  }
}

export const sandboxManager = new E2BSandboxManager();
