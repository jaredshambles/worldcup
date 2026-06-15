import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { randomUUID } from "crypto";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    generateId: () => randomUUID(),
  },
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
