import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { prisma, prismaAuth } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

// Helper to capitalize the first letter of a string
const capitalize = (str: string | null | undefined): string | null => {
  if (!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaAuth),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "login", // forces GitHub to show login screen
        },
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/" },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === "update" || user || !token.firstName) {
        const id = (user?.id || token?.id) as string;
        if (!id) return token;

        const dbUser = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            name: true,
            image: true,
          },
        });

        if (dbUser) {
          // derive full name from firstName+lastName, fallback to name
          const fullName =
            dbUser.firstName && dbUser.lastName
              ? `${dbUser.firstName} ${dbUser.lastName}`
              : dbUser.firstName
              ?? dbUser.lastName
              ?? dbUser.name
              ?? null;

          // write back to DB if name column is missing
          if (!dbUser.name && fullName) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { name: fullName },
            });
          }

          token.id = dbUser.id;
          token.email = dbUser.email;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.name = fullName;
          token.image = dbUser.image;
          token.isNewUser = !dbUser.firstName; // no firstName = needs onboarding
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }

      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    },

    async signIn({ user, account }: any) {
      if (!user.email) return false;

      // ── Magic link ──────────────────────────────────────────
      // account can be null on callback, handle FIRST
      if (!account || account.provider === "email") {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // brand new user via magic link → create minimal record
          existingUser = await prisma.user.create({
            data: { email: user.email },
          });
        }

        // if user came from OAuth before, they already have firstName
        // if not → isNewUser = true → proxy sends to /onboarding
        user.id = existingUser.id;
        user.isNewUser = !existingUser.firstName;
        return true;
      }

      // ── OAuth (Google / GitHub) ──────────────────────────────
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        // first time OAuth login → split name into firstName + lastName
        const nameParts = user.name?.split(" ") ?? [];
        const firstName = capitalize(nameParts[0]) ?? null;
        const lastName = capitalize(nameParts.slice(1).join(" ") || null);

        existingUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name ?? null,  // raw name for adapter
            firstName,
            lastName,
            image: user.image,
          },
        });
      } else if (!existingUser.firstName && user.name) {
        // existing user (created via magic link before) — backfill name from OAuth
        const nameParts = user.name.split(" ");
        const firstName = nameParts[0] ?? null;
        const lastName = nameParts.slice(1).join(" ") || null;

        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: user.name,
            firstName,
            lastName,
            image: existingUser.image ?? user.image, // keep existing image
          },
        });

        existingUser = { ...existingUser, firstName, lastName };
      }

      // link OAuth account if not already linked
      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
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

      user.id = existingUser.id;
      return true;
    },
  },
};