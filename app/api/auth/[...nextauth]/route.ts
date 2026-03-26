import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";



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

const authOptions = NextAuth({
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
    async jwt({ token, user, account }: any) {
      // 👉 Runs after signIn

      if (user) {
        // 🔥 This must be DB user id
        console.log("JWT USER ID:", user.id); // 👈 check this
        token.id = user.id;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token
      }

      return token;
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
        existingUser = await prisma.user.create({
          data: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
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
});

export { authOptions as GET, authOptions as POST };