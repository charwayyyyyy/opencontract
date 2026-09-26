import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || "f94a8c9b3e1d7a5b2c4e6f8a0b2c4d6e8f0a2b4c6d8e0a1b2c3d4e5f6a7b8c9d",
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token["role"] = (user as unknown as { role?: string }).role;
        token["id"] = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token["id"] as string;
        session.user.role = token["role"] as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  trustHost: true,
};
