import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createGithubConnection } from "@/features/github/services/github-connection-service";
import { db } from "@/db";
import { githubConnections, nodesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { assertWorkflowOwner } from "@/trpc/utils/assert-workflow-owner";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing GitHub authorization code." },
      { status: 400 },
    );
  }

  try {
    // 1. Get the currently authenticated Vangrex user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to connect GitHub." },
        { status: 401 },
      );
    }

    const state = request.nextUrl.searchParams.get("state");

    if (!state) {
      return NextResponse.json(
        {
          error: "Missing OAuth state.",
        },
        {
          status: 400,
        },
      );
    }

    const { workflowId, nodeId, projectId } = JSON.parse(
      Buffer.from(state, "base64url").toString("utf-8"),
    );

    if (!workflowId || !nodeId || !projectId) {
      return NextResponse.json(
        {
          error: "Invalid OAuth state.",
        },
        {
          status: 400,
        },
      );
    }

    // 2. Exchange GitHub authorization code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange GitHub authorization code.");
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("GitHub token response:", tokenData);

      return NextResponse.json(
        { error: "GitHub authorization failed." },
        { status: 400 },
      );
    }

    // 3. Get the GitHub user
    const githubResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!githubResponse.ok) {
      throw new Error("Failed to fetch GitHub user.");
    }

    const githubUser = await githubResponse.json();

    // 4. Save the connection
    const connection = await createGithubConnection({
      userId: session.user.id,
      githubUserId: String(githubUser.id),
      githubUsername: githubUser.login,
      accessToken: tokenData.access_token,
      scope: tokenData.scope,
    });

    const [node] = await db
      .select()
      .from(nodesTable)
      .where(eq(nodesTable.id, nodeId));

    if (!node) {
      return NextResponse.json(
        { error: "GitHub node not found." },
        { status: 404 },
      );
    }

    await assertWorkflowOwner(node.workflowId, session.user.id);

    await db
      .update(nodesTable)
      .set({
        config: {
          ...node.config,
          connectionId: connection.id,
        },
      })
      .where(eq(nodesTable.id, nodeId));

    console.log("[github] connection created:", {
      id: connection.id,
      username: connection.githubUsername,
    });

    console.log(githubUser, githubConnections, githubResponse);
    // 5. Redirect back to the app
    return NextResponse.redirect(
      new URL(
        `/projects/${projectId}/workflows/${workflowId}/canvas`,
        request.url,
      ),
    );
  } catch (error) {
    console.log(error);
  }
}
