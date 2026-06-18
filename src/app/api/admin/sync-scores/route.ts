import { getCurrentUser } from '@/lib/auth-server'

export async function POST() {
  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  if (!user.is_admin) {
    return Response.json({ error: 'Not authorized' }, { status: 403 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const res = await fetch(`${supabaseUrl}/functions/v1/sync-scores`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  if (!res.ok) {
    return Response.json(
      { error: data.error || 'Sync failed' },
      { status: res.status }
    )
  }

  return Response.json(data)
}
