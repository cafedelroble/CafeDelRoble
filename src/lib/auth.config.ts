import type { NextAuthConfig } from 'next-auth';

interface TokenWithRole {
  role?: string;
  id?: string;
}

export default {
  providers: [],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authorizedUser = user as { id: string; role: string };
        token.role = authorizedUser.role;
        token.id = authorizedUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      const tokenWithRole = token as TokenWithRole;
      if (session.user) {
        session.user.id = tokenWithRole.id || '';
        session.user.role = tokenWithRole.role || 'CLIENTE';
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
