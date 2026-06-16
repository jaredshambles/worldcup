import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",
  baseURL: process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: Replace with Resend/SendGrid for production
      console.log(`[Password Reset] Send to ${user.email}: ${url}`)
    },
  },
  user: {
    additionalFields: {
      full_name: {
        type: "string",
      },
      nickname: {
        type: "string",
      },
      is_admin: {
        type: "boolean",
        defaultValue: false,
      },
      avatar_url: {
        type: "string",
      },
    },
  },
});
