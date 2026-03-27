import { DefaultSession } from "next-auth"

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