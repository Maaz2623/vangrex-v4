// src/lib/sandbox/sandbox-filesystem.ts

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

  async list(sandboxId: string, path = "/") {
    const { sandbox } = await this.getSandbox(sandboxId);

    return await sandbox.files.list(path);
  }

  async read(sandboxId: string, path: string) {
    const { sandbox } = await this.getSandbox(sandboxId);

    return await sandbox.files.read(path);
  }

  async write(sandboxId: string, path: string, content: string) {
    const { sandbox } = await this.getSandbox(sandboxId);

    await sandbox.files.write(path, content);
  }

  async upload(sandboxId: string, path: string, base64: string) {
    const { sandbox } = await this.getSandbox(sandboxId);

    const buffer = Buffer.from(base64, "base64");

    // Convert Node Buffer to a standalone ArrayBuffer
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );

    await sandbox.files.write(path, arrayBuffer);
  }


   async uploadZip(
    sandboxId: string,
    destination: string,
    base64: string,
  ) {
    const { sandbox } = await this.getSandbox(sandboxId);

    const buffer = Buffer.from(base64, "base64");

    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );

    const zipPath = "/tmp/vangrex-upload.zip";

    // 1. Upload ZIP to sandbox.
    await sandbox.files.write(zipPath, arrayBuffer);

    // 2. Extract it into the requested destination.
    await sandbox.commands.run(
      `unzip -o -q "${zipPath}" -d "${destination}"`,
    );

    // 3. Remove temporary ZIP.
    await sandbox.files.remove(zipPath);
  }

  async createDirectory(sandboxId: string, path: string) {
    const { sandbox } = await this.getSandbox(sandboxId);

    await sandbox.files.makeDir(path);
  }

  async delete(sandboxId: string, path: string) {
    const { sandbox } = await this.getSandbox(sandboxId);

    await sandbox.files.remove(path);
  }

  async rename(sandboxId: string, oldPath: string, newPath: string) {
    const { sandbox } = await this.getSandbox(sandboxId);

    await sandbox.files.rename(oldPath, newPath);
  }
}

export const sandboxFilesystem = new SandboxFilesystem();
