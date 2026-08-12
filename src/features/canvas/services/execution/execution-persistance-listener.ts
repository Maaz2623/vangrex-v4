import "server-only";

import { db } from "@/db";
import { executionNodesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { executionEvents } from "./execution-events";
import { ExecutionEvent } from "./event-types";

const runningNodes = new Map<string, string>();

export function startExecutionPersistence() {
  return executionEvents.subscribe(async (event: ExecutionEvent) => {
    try {
      switch (event.type) {
        case "node:start": {
          const [executionNode] = await db
            .insert(executionNodesTable)
            .values({
              executionId: event.executionId,
              nodeId: event.nodeId,
              nodeType: event.nodeType,
              nodeTitle: event.nodeName,
              status: "running",
              startedAt: new Date(event.timestamp),
            })
            .returning({
              id: executionNodesTable.id,
            });

          if (executionNode) {
            runningNodes.set(
              `${event.executionId}:${event.nodeId}`,
              executionNode.id,
            );
          }

          break;
        }

        case "node:success": {
          const key = `${event.executionId}:${event.nodeId}`;
          const executionNodeId = runningNodes.get(key);

          if (!executionNodeId) break;

          await db
            .update(executionNodesTable)
            .set({
              status: "success",
              completedAt: new Date(event.timestamp),
              duration: event.duration,
            })
            .where(eq(executionNodesTable.id, executionNodeId));

          runningNodes.delete(key);

          break;
        }

        case "node:error": {
          const key = `${event.executionId}:${event.nodeId}`;
          const executionNodeId = runningNodes.get(key);

          if (!executionNodeId) break;

          await db
            .update(executionNodesTable)
            .set({
              status: "error",
              error:
                event.error instanceof Error
                  ? event.error.message
                  : String(event.error),
              completedAt: new Date(event.timestamp),
              duration: event.duration,
            })
            .where(eq(executionNodesTable.id, executionNodeId));

          runningNodes.delete(key);

          break;
        }
      }
    } catch (error) {
      console.error("[execution-persistence] Failed to persist event:", error);
    }
  });
}
