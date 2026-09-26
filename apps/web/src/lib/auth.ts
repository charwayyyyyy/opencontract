import NextAuth, { type NextAuthConfig, CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@opencontract/database/client";
import bcrypt from "bcryptjs";
import { signInSchema } from "@opencontract/validation";

import { authConfig } from "./auth.config";

class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

export const nextAuthConfig: NextAuthConfig = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = signInSchema.safeParse(credentials);
          if (!parsed.success) throw new CustomAuthError("Invalid credentials format");

          const { email, password } = parsed.data;

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              passwordHash: true,
              isActive: true,
            },
          });

          if (!user) throw new CustomAuthError("User not found in database");
          if (!user.passwordHash) throw new CustomAuthError("User has no password");
          if (!user.isActive) throw new CustomAuthError("User is inactive");

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) throw new CustomAuthError("Incorrect password");

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error("AUTH ERROR:", error);
          // Return null instead of throwing, which NextAuth will interpret as CredentialsSignin.
          // If the UI changes from Configuration to CredentialsSignin, we know this block is catching an exception!
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token["role"] = user.role;
        token["id"] = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
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

export const { handlers, auth, signIn, signOut } = NextAuth(nextAuthConfig);
export { authConfig };
