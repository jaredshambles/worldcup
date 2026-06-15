import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth-server'
import { AdminClient } from './AdminClient'
import type { Match, Profile } from '@/lib/types'

export const revalidate = 0

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/')

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  const [
    { data: matches },
    { data: players },
  ] = await Promise.all([
    supabase.from('matches').select('*').order('match_number'),
    supabase.from('profiles').select('*').order('full_name'),
  ])

  return (
    <AdminClient
      matches={(matches || []) as Match[]}
      players={(players || []) as Profile[]}
    />
  )
}
