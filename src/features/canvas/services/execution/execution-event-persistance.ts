import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { executionEventsTable } from "@/db/schema";

export async function getExecutionEvents(executionId: string) {
  return db
    .select()
    .from(executionEventsTable)
    .where(eq(executionEventsTable.executionId, executionId))
    .orderBy(asc(executionEventsTable.createdAt));
}
