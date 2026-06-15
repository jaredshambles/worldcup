import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth-server'
import { HomeContent } from './HomeContent'

export const revalidate = 30

export default async function HomePage() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  const [{ data: leaderboard }, { data: deadlines }, { data: matchStats }, { data: predictions }] = await Promise.all([
    supabase.from('leaderboard').select('*').order('rank'),
    supabase.from('deadlines').select('*').order('deadline_utc'),
    supabase.from('matches').select('status'),
    supabase.from('predictions').select('player_id, predicted_home, predicted_away, points_earned, matches!inner(match_number, home_team, away_team, home_score, away_score, status, group_letter, stage)').eq('matches.status', 'finished'),
  ])

  const finished = matchStats?.filter(m => m.status === 'finished').length || 0
  const total = matchStats?.length || 104

  const userEntry = user
    ? leaderboard?.find(e => e.player_id === user.id) || null
    : null

  const leaderPts = leaderboard?.[0]?.total_points || 0

  // Group predictions by player_id
  const predictionsByPlayer: Record<string, any[]> = {}
  for (const p of predictions || []) {
    if (!predictionsByPlayer[p.player_id]) predictionsByPlayer[p.player_id] = []
    predictionsByPlayer[p.player_id].push(p)
  }

  return (
    <HomeContent
      leaderboard={leaderboard || []}
      deadlines={deadlines || []}
      userEntry={userEntry}
      leaderPts={leaderPts}
      finished={finished}
      total={total}
      predictionsByPlayer={predictionsByPlayer}
    />
  )
}
