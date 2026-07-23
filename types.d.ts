import { authClient } from "@/lib/auth-client";

export type SessionData = ReturnType<typeof authClient.useSession>["data"];

export type AuthUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
};
