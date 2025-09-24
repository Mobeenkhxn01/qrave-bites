import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: string | undefined;
  }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
//  trustHost:true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", value: "password" },
        password: { label: "Password", type: "password", value: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials.");
        }
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            throw new Error("No user found.");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );
          if (!isValidPassword) {
            throw new Error("Invalid password.");
          }

          return {
            role: user.role ?? "",
            email: user.email,
            name: user.name,
            id: user.id,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth Error", error);
          throw error;
        }
      },
    }),
    Google,
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  //  cookies: {
  //   sessionToken: {
  //     name: "__Secure-next-auth.session-token",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  // },
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
