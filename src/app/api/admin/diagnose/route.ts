import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is admin
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return Response.json({ error: 'Not authorized' }, { status: 403 })
  }

  try {
    // Check match status
    const { data: matches } = await supabase
      .from('matches')
      .select('status')
      .order('id')

    const matchStatus = {
      total: matches?.length || 0,
      scheduled: matches?.filter(m => m.status === 'scheduled').length || 0,
      live: matches?.filter(m => m.status === 'live').length || 0,
      finished: matches?.filter(m => m.status === 'finished').length || 0,
    }

    // Check predictions
    const { data: predictions } = await supabase
      .from('predictions')
      .select('player_id, points_earned')

    const predictionStats = {
      total: predictions?.length || 0,
      withPoints: predictions?.filter(p => p.points_earned > 0).length || 0,
      zeroPoints: predictions?.filter(p => p.points_earned === 0).length || 0,
    }

    // Check leaderboard
    const { data: leaderboard } = await supabase
      .from('leaderboard')
      .select('player_id, total_points, match_points, bonus_points')
      .order('rank')

    const leaderboardStats = {
      totalPlayers: leaderboard?.length || 0,
      playersWithPoints: leaderboard?.filter(l => l.total_points > 0).length || 0,
      playersZeroPoints: leaderboard?.filter(l => l.total_points === 0).length || 0,
      topPlayers: leaderboard?.slice(0, 5).map(l => ({
        player_id: l.player_id,
        points: l.total_points,
      })),
    }

    // Get sample finished matches with scores
    const { data: finishedMatches } = await supabase
      .from('matches')
      .select('id, match_number, home_team, away_team, home_score, away_score, status')
      .eq('status', 'finished')
      .order('id')
      .limit(5)

    // Get current profile names
    const { data: profileNames } = await supabase
      .from('profiles')
      .select('id, email, full_name, nickname')
      .order('full_name')

    return Response.json({
      matchStatus,
      predictionStats,
      leaderboardStats,
      sampleFinishedMatches: finishedMatches,
      currentProfiles: profileNames?.slice(0, 10), // Show first 10 profiles
      totalProfiles: profileNames?.length || 0,
    })
  } catch (error) {
    console.error('Diagnostic error:', error)
    return Response.json({ error: 'Diagnostic check failed' }, { status: 500 })
  }
}
