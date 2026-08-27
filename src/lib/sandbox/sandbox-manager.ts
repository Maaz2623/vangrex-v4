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
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      throw new Error("GITHUB_TOKEN is not configured.");
    }

    const sandbox = await Sandbox.create({
      envs: {
        GITHUB_TOKEN: githubToken,
      },
    });

    console.log("[sandbox] created: ", sandbox.sandboxId);

    await sandbox.commands.run(`git config --global user.name "Vangrex Agent"`);

    await sandbox.commands.run(
      `git config --global user.email "agent@vangrex.dev"`,
    );

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
