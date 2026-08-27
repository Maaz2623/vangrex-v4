import Sandbox from "e2b";

export interface SandboxInstance {
  id: string;
  sandbox: Sandbox;
}

export interface SandboxManager {
  create(): Promise<SandboxInstance>;
  getUrl(sandbox: SandboxInstance, port: number): string;
  kill(sandbox: SandboxInstance): Promise<void>;
  get(id: string): Promise<SandboxInstance>;
}

class E2BSandboxManager implements SandboxManager {
  async create(): Promise<SandboxInstance> {
    const sandbox = await Sandbox.create({
      envs: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN!,
      },
    });

    console.log("[sandbox] created: ", sandbox.sandboxId);

    return {
      id: sandbox.sandboxId,
      sandbox,
    };
  }

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
