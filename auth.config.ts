import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },

    async jwt({ token, user }) {
      // When user logs in, `user` is defined
      if (user) {
        // Prisma user has `id`
        token.id = (user as any).id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Copy id from token onto session.user
        (session.user as any).id = (token as any).id ?? token.sub;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
