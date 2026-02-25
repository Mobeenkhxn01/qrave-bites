import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

type Role = "ADMIN" | "RESTAURANT_OWNER" | "USER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      restaurantStatus?: string;
      trialEndsAt?: Date | null;
      subscriptionStatus?: string | null;
      plan?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma as any),

  trustHost: true,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = String(credentials?.email || "");
        const password = String(credentials?.password || "");

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role as Role,
        };
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: Role }).role;

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            role: true,
            restaurantStatus: true,
            trialEndsAt: true,
            subscriptionStatus: true,
            plan: true,
          },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.restaurantStatus = dbUser.restaurantStatus;
          token.trialEndsAt = dbUser.trialEndsAt;
          token.subscriptionStatus = dbUser.subscriptionStatus;
          token.plan = dbUser.plan;
        }

        return token;
      }

      if (token?.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              role: true,
              restaurantStatus: true,
              trialEndsAt: true,
              subscriptionStatus: true,
              plan: true,
            },
          });

          if (dbUser) {
            token.role = dbUser.role;
            token.restaurantStatus = dbUser.restaurantStatus;
            token.trialEndsAt = dbUser.trialEndsAt;
            token.subscriptionStatus = dbUser.subscriptionStatus;
            token.plan = dbUser.plan;
          }
        } catch (error) {
          console.error("JWT refresh error:", error);
        }
      }

      return token;
    },

   async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.role = token.role as Role;

    session.user.restaurantStatus =
      token.restaurantStatus as string | undefined;
    session.user.trialEndsAt =
      token.trialEndsAt as Date | undefined;
    session.user.subscriptionStatus =
      token.subscriptionStatus as string | undefined;
    session.user.plan = token.plan as string | undefined;
  }

  return session;
},
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // fallback
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  secret: process.env.AUTH_SECRET,
});
