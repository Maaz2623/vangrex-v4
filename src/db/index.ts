import { drizzle } from "drizzle-orm/neon-serverless";

import { Pool, neonConfig } from "@neondatabase/serverless";

import ws from "ws";

neonConfig.webSocketConstructor = ws;

export function getDB() {
  const connectionString = process.env.DATABASE_URL!;

  if (!connectionString) {
    throw new Error("DATBASE_URL is not defined.");
  }

  return drizzle(connectionString);
}

export const db = getDB();
