import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AuthService } from "@/services/auth.service";

/**
 * Auth.js (NextAuth v5 beta) Configuration for AP Enerfy Solar ERP
 * Secure JWT strategy with real-time session version invalidation and RBAC token scoping.
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "AP Enerfy Solar Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "boolean" },
      },
      async authorize(credentials, req) {
        const identifier = (credentials?.identifier || (credentials as any)?.email) as string;
        const password = credentials?.password as string;
        const rememberMe = Boolean(credentials?.rememberMe);

        if (!identifier || !password) {
          throw new Error("Please enter both email/username and password.");
        }

        const ip = (req?.headers as any)?.get?.("x-forwarded-for") || undefined;
        const userAgent = (req?.headers as any)?.get?.("user-agent") || undefined;

        const result = await AuthService.login(identifier, password, ip, userAgent, rememberMe);

        if (!result.success || !result.user) {
          throw new Error(result.error || "Invalid email/username or password.");
        }

        return {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          username: result.user.username,
          role: result.user.role,
          roles: result.user.roles,
          permissions: result.user.permissions,
          branchId: result.user.branchId,
          mustChangePassword: result.user.mustChangePassword,
          sessionVersion: result.user.sessionVersion || 1,
          defaultPath: result.defaultPath,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = (user as any).username;
        token.role = (user as any).role;
        token.roles = (user as any).roles;
        token.permissions = (user as any).permissions;
        token.branchId = (user as any).branchId;
        token.mustChangePassword = (user as any).mustChangePassword;
        token.sessionVersion = (user as any).sessionVersion;
        token.defaultPath = (user as any).defaultPath;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).username = token.username as string;
        (session.user as any).role = token.role as string;
        (session.user as any).roles = token.roles as string[];
        (session.user as any).permissions = token.permissions as string[];
        (session.user as any).branchId = token.branchId as string;
        (session.user as any).mustChangePassword = token.mustChangePassword as boolean;
        (session.user as any).sessionVersion = token.sessionVersion as number;
        (session.user as any).defaultPath = token.defaultPath as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days default
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.AUTH_SECRET || "ap-enerfy-solar-production-super-secret-key-32chars",
});
