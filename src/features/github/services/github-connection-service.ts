import { db } from "@/db";
import { githubConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import "server-only";

export async function getGithubConnections(userId: string) {
  return db
    .select({
      id: githubConnections.id,
      githubUserId: githubConnections.githubUserId,
      githubUsername: githubConnections.githubUsername,
      scope: githubConnections.scope,
      createdAt: githubConnections.createdAt,
    })
    .from(githubConnections)
    .where(eq(githubConnections.userId, userId));
}

export async function createGithubConnection(input: {
  userId: string;
  githubUserId: string;
  githubUsername: string;
  accessToken: string;
  scope?: string;
}) {
  const [connection] = await db
    .insert(githubConnections)
    .values({
      userId: input.userId,
      githubUserId: input.githubUserId,
      githubUsername: input.githubUsername,
      accessToken: input.accessToken,
      scope: input.scope,
    })
    .returning({
      id: githubConnections.id,
      githubUserId: githubConnections.githubUserId,
      githubUsername: githubConnections.githubUsername,
      scope: githubConnections.scope,
      createdAt: githubConnections.createdAt,
    });

  return connection;
}

export async function getGithubConnection(
  userId: string,
  connectionId: string,
) {
  const [connection] = await db
    .select()
    .from(githubConnections)
    .where(eq(githubConnections.id, connectionId))
    .limit(1);

  if (!connection) {
    throw new Error("GitHub connection not found.");
  }

  if (connection.userId !== userId) {
    throw new Error("Unauthorized GitHub connection.");
  }

  return connection;
}
