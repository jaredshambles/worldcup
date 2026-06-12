import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminClient } from './AdminClient'
import type { Match, Profile, BonusQuestion } from '@/lib/types'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  const [
    { data: matches },
    { data: profiles },
    { data: bonusQuestions },
  ] = await Promise.all([
    supabase.from('matches').select('*').order('match_number'),
    supabase.from('profiles').select('*').order('full_name'),
    supabase.from('bonus_questions').select('*'),
  ])

  return (
    <AdminClient
      matches={(matches || []) as Match[]}
      profiles={(profiles || []) as Profile[]}
      bonusQuestions={(bonusQuestions || []) as BonusQuestion[]}
    />
  )
}
