import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'

export async function GET() {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    id: session.user.id,
    must_change_password: (session.user as any).must_change_password ?? false,
  })
}
