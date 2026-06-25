const baseURL = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

async function authFetch(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${baseURL}/api/auth${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}
  if (!res.ok) {
    return { data: null, error: { message: data.message || data.error || 'Request failed' } }
  }
  return { data, error: null }
}

export const signIn = {
  email: (opts: { email: string; password: string }) =>
    authFetch('/sign-in/email', opts),
}

export const signUp = {
  email: (opts: { email: string; password: string; name: string; callbackURL?: string }) =>
    authFetch('/sign-up/email', opts),
}

export async function forgetPassword(opts: { email: string; redirectTo: string }) {
  return authFetch('/forget-password', opts)
}

export async function resetPassword(opts: { newPassword: string; token?: string }) {
  return authFetch('/reset-password', opts)
}

export async function changePassword(opts: { currentPassword: string; newPassword: string }) {
  return authFetch('/change-password', opts)
}

export async function signOut() {
  return authFetch('/sign-out', {})
}
