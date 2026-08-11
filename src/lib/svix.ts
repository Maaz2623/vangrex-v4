import "server-only";

import { Svix } from "svix";

if (!process.env.SVIX_TOKEN) {
  throw new Error("SVIX_TOKEN is not configured.");
}

export const svix = new Svix(process.env.SVIX_TOKEN);
