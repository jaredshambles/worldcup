import { cookies } from 'next/headers'
import { prisma } from './prisma'

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const rawToken = cookieStore.get('better-auth.session_token')?.value
      || cookieStore.get('__Secure-better-auth.session_token')?.value
    if (!rawToken) return null

    // better-auth cookie format is "token.signature" — strip the signature
    const token = rawToken.split('.')[0]

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) return null

    return { session, user: session.user }
  } catch (error) {
    console.error('Session check error:', error)
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}
