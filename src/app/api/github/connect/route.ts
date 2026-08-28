import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub OAuth is not configured." },
      { status: 500 },
    );
  }
  const workflowId = request.nextUrl.searchParams.get("workflowId");

  const nodeId = request.nextUrl.searchParams.get("nodeId");

  const projectId = request.nextUrl.searchParams.get("projectId")

  if (!workflowId || !nodeId || !projectId) {
    return NextResponse.json(
      {
        error: "Missing workflow or node information",
      },
      {
        status: 400,
      },
    );
  }

  const state = Buffer.from(
    JSON.stringify({
      workflowId,
      nodeId,
      projectId
    })
  ).toString("base64url")



  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: "http://localhost:3000/api/github/callback",
    scope: "repo",
    state
  });

  const githubUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(githubUrl);
}
