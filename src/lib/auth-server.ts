import { headers } from 'next/headers'
import { auth } from './auth'

export async function getSession() {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({
      headers: headersList,
    })
    return session
  } catch (error) {
    console.error('Session check error:', error)
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}
