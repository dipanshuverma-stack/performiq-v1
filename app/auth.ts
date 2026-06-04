import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
// Keep your existing provider imports here (e.g., Google, GitHub, Credentials)

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. Keep your existing setup intact here:
  adapter: PrismaAdapter(prisma),
  providers: [
    // ⚠️ DO NOT DELETE THIS: Put your existing providers here (e.g., Google(), GitHub())
  ],
  
  // 2. Add the callbacks property right next to it:
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});