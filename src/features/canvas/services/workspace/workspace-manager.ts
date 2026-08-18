import "server-only";

import { mkdir, readFile, writeFile, readdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { promisify } from "util";
import { execFile } from "child_process";

const exeFileAsync = promisify(execFile);

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

  runCommand(
    workspace: Workspace,
    command: string,
    args?: string[],
  ): Promise<{
    stdout: string;
    stderr: string;
  }>;

  listFiles(workspace: Workspace, directory?: string): Promise<string[]>;
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

  async runCommand(
    workspace: Workspace,
    command: string,
    args?: string[],
  ): Promise<{
    stdout: string;
    stderr: string;
  }> {
    const { stdout, stderr } = await exeFileAsync(command, args, {
      cwd: workspace.path,
      maxBuffer: 10 * 1024 * 1024,
    });

    return {
      stdout,
      stderr,
    };
  }

  async listFiles(workspace: Workspace, directory = "."): Promise<string[]> {
    const absolutePath = this.resolvePath(workspace, directory);

    return readdir(absolutePath);
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
