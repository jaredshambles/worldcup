import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getCurrentUser, requirePasswordChanged } from '@/lib/auth-server'
import { STAGE_LABELS, STAGE_ORDER } from '@/lib/types'
import type { PredictionWithMatch, LeaderboardEntry } from '@/lib/types'
import { DashboardClient } from './DashboardClient'

export const revalidate = 30

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?from=expired')
  await requirePasswordChanged()

  const supabase = await createClient()
  const serviceSupabase = createServiceClient()

  // Ensure user profile exists (uses service role to bypass RLS)
  try {
    await serviceSupabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        full_name: (user as any).full_name || user.name || user.email?.split('@')[0],
      },
      { onConflict: 'id' }
    )
  } catch (error) {
    console.error('Profile creation error:', error)
  }

  const [
    { data: predictions, error: predError },
    { data: leaderboard, error: leaderError },
    { data: bonusAnswers, error: bonusError },
    { data: bonusQuestions, error: questionsError },
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

  // Log any errors for debugging
  if (predError) console.error('Predictions error:', predError)
  if (leaderError) console.error('Leaderboard error:', leaderError)
  if (bonusError) console.error('Bonus answers error:', bonusError)
  if (questionsError) console.error('Bonus questions error:', questionsError)

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
