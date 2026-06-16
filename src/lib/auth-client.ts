import { createAuthClient } from "better-auth/react";

function getBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signUp, signIn, signOut, useSession } = authClient;
export const forgetPassword = (authClient as any).forgetPassword?.bind(authClient) ?? (async () => ({ error: { message: 'Not supported' } }));
export const resetPassword = (authClient as any).resetPassword?.bind(authClient) ?? (async () => ({ error: { message: 'Not supported' } }));
