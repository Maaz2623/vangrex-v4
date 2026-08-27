import { NextResponse } from "next/server";

import { sandboxManager } from "@/lib/sandbox/sandbox-manager";

export async function GET() {
  const sandbox = await sandboxManager.create();

  try {
    await sandbox.sandbox.commands.run(
      `git config --global user.name "Vangrex Agent"`,
    );

    await sandbox.sandbox.commands.run(
      `git config --global user.email "agent@vangrex.dev"`,
    );

    // 1. Clone the GitHub repository without putting
    // the token in the command.
    const cloneResult = await sandbox.sandbox.commands.run(
      "git clone https://github.com/Maaz2623/nextjs-test-v2.git test-repo",
    );

    console.log("[git] clone:", {
      stdout: cloneResult.stdout,
      stderr: cloneResult.stderr,
    });

    if (cloneResult.exitCode !== 0) {
      throw new Error(
        `Git clone failed: ${cloneResult.stderr || cloneResult.stdout}`,
      );
    }

    // 2. Create a test file inside the repository.
    const writeResult = await sandbox.sandbox.commands.run(
      `cd test-repo && echo "Hello from Vangrex" > vangrex-test.txt`,
    );

    console.log("[git] write:", {
      stdout: writeResult.stdout,
      stderr: writeResult.stderr,
    });

    if (writeResult.exitCode !== 0) {
      throw new Error(
        `File creation failed: ${writeResult.stderr || writeResult.stdout}`,
      );
    }

    // 3. Check Git status.
    const statusResult = await sandbox.sandbox.commands.run(
      "cd test-repo && git status --short",
    );

    console.log("[git] status:", statusResult.stdout);

    // 4. Stage the change.
    const addResult = await sandbox.sandbox.commands.run(
      "cd test-repo && git add vangrex-test.txt",
    );

    console.log("[git] add:", {
      stdout: addResult.stdout,
      stderr: addResult.stderr,
    });

    if (addResult.exitCode !== 0) {
      throw new Error(
        `Git add failed: ${addResult.stderr || addResult.stdout}`,
      );
    }

    // 5. Commit.
    const commitResult = await sandbox.sandbox.commands.run(
      `cd test-repo && git commit -m "Test Vangrex Git integration"`,
    );

    console.log("[git] commit:", {
      stdout: commitResult.stdout,
      stderr: commitResult.stderr,
    });

    if (commitResult.exitCode !== 0) {
      throw new Error(
        `Git commit failed: ${commitResult.stderr || commitResult.stdout}`,
      );
    }

    // 6. Push to GitHub.
    const pushResult = await sandbox.sandbox.commands.run(
      "cd test-repo && git push origin main",
    );

    console.log("[git] push:", {
      stdout: pushResult.stdout,
      stderr: pushResult.stderr,
    });

    if (pushResult.exitCode !== 0) {
      throw new Error(
        `Git push failed: ${pushResult.stderr || pushResult.stdout}`,
      );
    }

    return NextResponse.json({
      success: true,
      sandboxId: sandbox.id,
      clone: {
        stdout: cloneResult.stdout,
        stderr: cloneResult.stderr,
      },
      status: statusResult.stdout,
      commit: {
        stdout: commitResult.stdout,
        stderr: commitResult.stderr,
      },
      push: {
        stdout: pushResult.stdout,
        stderr: pushResult.stderr,
      },
    });
  } finally {
    await sandbox.sandbox.kill();
  }
}
