import { sandboxManager } from "@/lib/sandbox/sandbox-manager";
import { FileType } from "e2b";

export interface SandboxFile {
  name: string;
  type: FileType;
  path: string;
  size: number;
  modifiedTime: Date;
}

export class SandboxFilesystem {
  private async getSandbox(sandboxId: string) {
    return await sandboxManager.get(sandboxId);
  }

  async list(sandboxId: string, path = "/"): Promise<SandboxFile[]> {
    const sandbox = await this.getSandbox(sandboxId);
    const files = await sandbox.sandbox.files.list(path);

    return files.map((file) => {
      if (!file.type) {
        throw new Error(`Missing file type for ${file.path}`);
      }

      if (!file.modifiedTime) {
        throw new Error(`Missing modified time for ${file.path}`);
      }

      return {
        name: file.name,
        type: file.type,
        path: file.path,
        size: file.size,
        modifiedTime: file.modifiedTime,
      };
    });
  }

  async read(sandboxId: string, path: string): Promise<string> {
    const sandbox = await this.getSandbox(sandboxId);
    return await sandbox.sandbox.files.read(path);
  }

  async write(sandboxId: string, path: string, content: string): Promise<void> {
    const sandbox = await this.getSandbox(sandboxId);
    await sandbox.sandbox.files.write(path, content);
  }

  async createDirectory(sandboxId: string, path: string): Promise<void> {
    const sandbox = await this.getSandbox(sandboxId);
    await sandbox.sandbox.files.makeDir(path);
  }

  async delete(sandboxId: string, path: string): Promise<void> {
    const sandbox = await this.getSandbox(sandboxId);
    await sandbox.sandbox.files.remove(path);
  }

  async rename(
    sandboxId: string,
    oldPath: string,
    newPath: string,
  ): Promise<void> {
    const sandbox = await this.getSandbox(sandboxId);
    await sandbox.sandbox.files.rename(oldPath, newPath);
  }
}

export const sandboxFilesystem = new SandboxFilesystem();
