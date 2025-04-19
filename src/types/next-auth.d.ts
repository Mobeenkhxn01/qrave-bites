// src/types/next-auth.d.ts
import { UserRole } from "@prisma/client";
import type { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    id: string;
    email: string;
    emailVerified: Date | null;
    role: UserRole;
  }
}
