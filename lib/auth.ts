import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
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
    async jwt({ token, user }) {
      if (user) {
        // Only runs on first login — store DB profile in token
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, email: true, firstName: true, lastName: true, image: true }
        })

        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email
          token.firstName = dbUser.firstName
          token.lastName = dbUser.lastName
          token.image = dbUser.image
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        // ✅ Read from token (cached), not DB on every request
        session.user.name = [token.firstName, token.lastName]
          .filter(Boolean)
          .join(" ")
        session.user.image = token.image as string
      }

      if (token.accessToken) {
        session.accessToken = token.accessToken
      }

      return session
    },
    async signIn({ user, account }: any) {

      if (!account) return false

      //safty check
      if (!user.email) {
        console.log("Email is required")
        return false
      }

      // 1 Check if user already exists in DB
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      //2 create if not exists
      if (!existingUser) {
        const nameParts = user.name?.split(" ") ?? []
        const firstName = nameParts[0] ?? null
        const lastName = nameParts.slice(1).join(" ") ?? null  // handles middle names too
        existingUser = await prisma.user.create({
          data: {
            email: user.email,
            firstName,
            lastName,
            image: user.image
          }
        })
      }

      // 3) Link account if not exists
      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: account.provider,
          providerAccountId: account.providerAccountId
        }
      });

      if (!existingAccount) {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {},
          create: {
            userId: existingUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: account.type,
          },
        });
      }
      user.id = existingUser.id

      return true
    }

  },
};
