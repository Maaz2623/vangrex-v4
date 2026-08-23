import Sandbox from "e2b";

export interface SandboxInstance {
  id: string;
  sandbox: Sandbox;
}

export interface SandboxManager {
  create(): Promise<SandboxInstance>;
  kill(sandbox: SandboxInstance): Promise<void>;
}

class E2BSandboxManager implements SandboxManager {
  async create(): Promise<SandboxInstance> {
    const sandbox = await Sandbox.create();

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
}

export const sandboxManager = new E2BSandboxManager();
