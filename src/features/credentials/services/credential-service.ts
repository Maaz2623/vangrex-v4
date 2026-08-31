import { db } from "@/db";
import { credentialsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";


export async function createCredential(
  userId: string,
  name: string,
  value: string,
) {
  const [credential] = await db
    .insert(credentialsTable)
    .values({
      userId,
      name,
      value,
    })
    .returning({
      id: credentialsTable.id,
      name: credentialsTable.name,
    });

  return credential;
}

export async function getCredential(userId: string, credentialId: string) {
  const [credential] = await db
    .select()
    .from(credentialsTable)
    .where(
      and(
        eq(credentialsTable.id, credentialId),
        eq(credentialsTable.userId, userId),
      ),
    )
    .limit(1);

  return credential;
}

export async function deleteCredential(userId: string, credentialId: string) {
  await db
    .delete(credentialsTable)
    .where(
      and(
        eq(credentialsTable.id, credentialId),
        eq(credentialsTable.userId, userId),
      ),
    );
}
