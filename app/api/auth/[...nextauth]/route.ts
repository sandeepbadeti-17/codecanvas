import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient } from "@/lib/generated/prisma";



// 🔥 Module Augmentation: Extend NextAuth default types
// We are NOT replacing types — we are adding custom fields
// This ensures TypeScript knows about our custom properties (id, accessToken)

// 👉 Because the data structure is different
// Session = nested (user object) → merge with DefaultSession["user"]
// JWT = flat object → extend directly

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
  }
}

// const prisma = new PrismaClient();

const handler = NextAuth({
  // adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      // 🔑 Runs on login + every request
      // 👉 Only set values on initial login (when account exists)

      if (account) {
        token.accessToken = account.access_token

        // ⚠️ Different providers return different user IDs
        // Google → sub | GitHub → id
        if (account.provider === "google") {
          token.id = (profile as { sub?: string })?.sub
        }

        if (account.provider === "github") {
          token.id = (profile as { id?: number })?.id?.toString()
        }
      }

      // 🧠 JWT is the source of truth → data stored here persists across requests
      return token
    },

    async session({ session, token }) {
      // 🔁 Runs whenever session is accessed (frontend: useSession)
      if (session.user && token.id) {
        session.user.id = token.id
      }

      if (token.accessToken) {
        session.accessToken = token.accessToken
      }

      // 🎯 Session = filtered view of JWT (what we expose to frontend)
      return session
    },
  },
});

export { handler as GET, handler as POST };