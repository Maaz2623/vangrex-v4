import { NextRequest } from "next/server";
import { ZipArchive } from "archiver";
import { PassThrough } from "stream";

import { sandboxManager } from "@/lib/sandbox/sandbox-manager";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      sandboxId: string;
    }>;
  },
) {
  try {
    const { sandboxId } = await params;
    const path = request.nextUrl.searchParams.get("path");

    if (!path) {
      return new Response("Missing path", {
        status: 400,
      });
    }

    if (!path.startsWith("/")) {
      return new Response("Invalid path", {
        status: 400,
      });
    }

    const { sandbox } = await sandboxManager.get(sandboxId);

    const info = await sandbox.files.getInfo(path);

    // ---------------------------------------------------------
    // SINGLE FILE
    // ---------------------------------------------------------

    if (info.type !== "dir") {
      const bytes = await sandbox.files.read(path, {
        format: "bytes",
      });

      const body = new Uint8Array(bytes).buffer;

      const filename = path.split("/").filter(Boolean).pop() || "download";

      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": String(body.byteLength),
          "Cache-Control": "no-store",
        },
      });
    }

    // ---------------------------------------------------------
    // FOLDER
    // ---------------------------------------------------------

    const files = await getAllFiles(sandbox, path);

    const archive = new ZipArchive({
      zlib: {
        level: 6,
      },
    });

    const output = new PassThrough();

    archive.pipe(output);

    const folderName =
      info.name || path.split("/").filter(Boolean).pop() || "folder";

    for (const file of files) {
      const bytes = await sandbox.files.read(file.path, {
        format: "bytes",
      });

      const buffer = Buffer.from(bytes);

      const relativePath = file.path
        .replace(`${path}/`, "")
        .replace(/^\/+/, "");

      archive.append(buffer, {
        name: `${folderName}/${relativePath}`,
      });
    }

    await archive.finalize();

    const chunks: Buffer[] = [];

    for await (const chunk of output) {
      chunks.push(Buffer.from(chunk));
    }

    const zipBuffer = Buffer.concat(chunks);

    return new Response(
      zipBuffer.buffer.slice(
        zipBuffer.byteOffset,
        zipBuffer.byteOffset + zipBuffer.byteLength,
      ) as ArrayBuffer,
      {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${folderName}.zip"`,
          "Content-Length": String(zipBuffer.byteLength),
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("[sandbox download]", error);

    return new Response(
      error instanceof Error ? error.message : "Download failed",
      {
        status: 500,
      },
    );
  }
}

// ---------------------------------------------------------
// Recursively collect files
// ---------------------------------------------------------

async function getAllFiles(
  sandbox: any,
  directory: string,
): Promise<Array<{ path: string }>> {
  const entries = await sandbox.files.list(directory);

  const files: Array<{ path: string }> = [];

  for (const entry of entries) {
    const entryPath = entry.path;

    if (entry.type === "dir") {
      const nestedFiles = await getAllFiles(sandbox, entryPath);

      files.push(...nestedFiles);
    } else {
      files.push({
        path: entryPath,
      });
    }
  }

  return files;
}
