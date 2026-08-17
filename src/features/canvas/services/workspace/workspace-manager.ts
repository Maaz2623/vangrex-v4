import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface Workspace {
  id: string;
  path: string;
}

export interface WorkspaceManager {
  create(): Promise<Workspace>;

  readFile(workspace: Workspace, filePath: string): Promise<string>;

  writeFile(
    workspace: Workspace,
    filePath: string,
    content: string,
  ): Promise<void>;
}

class LocalWorkspaceManager implements WorkspaceManager {
  private readonly root = path.join(process.cwd(), ".vangrex", "workspaces");

  async create(): Promise<Workspace> {
    const id = crypto.randomUUID();

    const workspacePath = path.join(this.root, id);

    await mkdir(workspacePath, {
      recursive: true,
    });

    return {
      id,
      path: workspacePath,
    };
  }

  async readFile(workspace: Workspace, filePath: string): Promise<string> {
    const absolutePath = this.resolvePath(workspace, filePath);

    return readFile(absolutePath, "utf8");
  }

  async writeFile(
    workspace: Workspace,
    filePath: string,
    content: string,
  ): Promise<void> {
    const absolutePath = this.resolvePath(workspace, filePath);

    await mkdir(path.dirname(absolutePath), {
      recursive: true,
    });

    await writeFile(absolutePath, content, "utf8");
  }

  private resolvePath(workspace: Workspace, filePath: string) {
    const resolved = path.resolve(workspace.path, filePath);

    const workspaceRoot = path.resolve(workspace.path);

    if (
      resolved !== workspaceRoot &&
      !resolved.startsWith(`${workspaceRoot}${path.sep}`)
    ) {
      throw new Error("Invalid workspace path.");
    }

    return resolved;
  }
}

export const workspaceManager = new LocalWorkspaceManager();
