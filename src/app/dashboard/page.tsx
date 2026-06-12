import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { STAGE_LABELS, STAGE_ORDER } from '@/lib/types'
import type { PredictionWithMatch, LeaderboardEntry } from '@/lib/types'
import { DashboardClient } from './DashboardClient'

export const revalidate = 30

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Ensure user profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingProfile) {
    // Create profile if it doesn't exist (in case trigger didn't fire)
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
    })
  }

  const [
    { data: predictions },
    { data: leaderboard },
    { data: bonusAnswers },
    { data: bonusQuestions },
  ] = await Promise.all([
    supabase
      .from('predictions')
      .select('*, matches(*)')
      .eq('player_id', user.id)
      .order('match_id'),
    supabase.from('leaderboard').select('*'),
    supabase.from('bonus_answers').select('*').eq('player_id', user.id),
    supabase.from('bonus_questions').select('*'),
  ])

  const me = leaderboard?.find(e => e.player_id === user.id) as LeaderboardEntry | undefined
  const preds = (predictions || []) as PredictionWithMatch[]

  return (
    <DashboardClient
      me={me ?? null}
      predictions={preds}
      leaderboard={leaderboard || []}
      bonusAnswers={bonusAnswers || []}
      bonusQuestions={bonusQuestions || []}
    />
  )
}
