import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-server'
import type { Profile } from '@/lib/types'
import { H2HClient } from './H2HClient'

export const revalidate = 30

export default async function HeadToHeadPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = await createClient()

  const [{ data: profiles }, { data: matches }, { data: allPredictions }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, nickname'),
    supabase.from('matches').select('*').eq('status', 'finished').order('match_number'),
    supabase.from('predictions').select('*'),
  ])

  return (
    <H2HClient
      userId={user.id}
      profiles={(profiles || []) as Pick<Profile, 'id' | 'full_name' | 'nickname'>[]}
      matches={matches || []}
      allPredictions={allPredictions || []}
    />
  )
}
