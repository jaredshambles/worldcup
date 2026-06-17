import { cookies } from 'next/headers'
import { prisma } from './prisma'

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('better-auth.session_token')?.value
      || cookieStore.get('__Secure-better-auth.session_token')?.value
    if (!token) return null

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
