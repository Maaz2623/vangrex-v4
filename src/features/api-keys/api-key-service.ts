import { db } from "@/db";
import { apiKeysTable } from "@/db/schema";
import { createHash, randomBytes } from "crypto";
import { and, eq, isNull } from "drizzle-orm";

function hashApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

function generateApiKey() {
  const secret = randomBytes(32).toString("hex");

  return `vgx_live_${secret}`;
}

export async function createApiKey(params: {
  projectId: string;
  userId: string;
  name: string;
}) {
  const key = generateApiKey();

  const keyHash = hashApiKey(key);

  const keyPrefix = key.slice(0, 14);

  const [apiKey] = await db
    .insert(apiKeysTable)
    .values({
      projectId: params.projectId,
      userId: params.userId,
      name: params.name,
      keyPrefix,
      keyHash,
    })
    .returning({
      id: apiKeysTable.id,
      projectId: apiKeysTable.projectId,
      name: apiKeysTable.name,
      keyPrefix: apiKeysTable.keyPrefix,
      createdAt: apiKeysTable.createdAt,
    });

  return {
    ...apiKey,
    key,
  };
}

export async function authenticateApiKey(key: string) {
  const keyHash = hashApiKey(key);

  const [apiKey] = await db
    .select({
      id: apiKeysTable.id,
      projectId: apiKeysTable.projectId,
      userId: apiKeysTable.userId,
    })
    .from(apiKeysTable)
    .where(
      and(eq(apiKeysTable.keyHash, keyHash), isNull(apiKeysTable.revokedAt)),
    )
    .limit(1);

  if (!apiKey) {
    return null;
  }

  await db.update(apiKeysTable).set({
    lastUsedAt: new Date(),
  });

  return apiKey;
}

export async function revokeApiKey(apiKeyId: string) {
  const [apiKey] = await db
    .update(apiKeysTable)
    .set({
      revokedAt: new Date(),
    })
    .where(eq(apiKeysTable.id, apiKeyId))
    .returning({
      id: apiKeysTable.id,
    });

  return apiKey;
}
