import { NextResponse } from "next/server";
import { sandboxManager } from "@/lib/sandbox/sandbox-manager";

export async function GET() {
  const sandbox = await sandboxManager.create();

  try {
    // 1. Create a directory
    await sandbox.sandbox.commands.run("mkdir -p test-project");

    // 2. Create a file
    await sandbox.sandbox.commands.run(
      "echo 'Hello from E2B' > test-project/hello.txt",
    );

    // 3. Read it back
    const result = await sandbox.sandbox.commands.run(
      "cat test-project/hello.txt",
    );

    console.log("[e2b] command output:", result.stdout);

    return NextResponse.json({
      sandboxId: sandbox.id,
      output: result.stdout,
    });
  } finally {
    await sandbox.sandbox.kill();
  }
}
