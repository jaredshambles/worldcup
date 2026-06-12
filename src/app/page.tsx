import { createClient } from '@/lib/supabase/server'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { RankCard } from '@/components/RankCard'
import { DeadlineBanner } from '@/components/DeadlineBanner'

export const revalidate = 30

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: leaderboard }, { data: deadlines }, { data: matchStats }] = await Promise.all([
    supabase.from('leaderboard').select('*').order('rank'),
    supabase.from('deadlines').select('*').order('deadline_utc'),
    supabase.from('matches').select('status'),
  ])

  const finished = matchStats?.filter(m => m.status === 'finished').length || 0
  const total = matchStats?.length || 104

  // Find user in leaderboard (assuming auth is set up)
  const userEntry = leaderboard?.[0] // In real implementation, filter by auth.user.id

  return (
    <div className="space-y-6 pb-6">
      <DeadlineBanner deadlines={deadlines || []} />

      {/* Rank Card - Hero Section */}
      {userEntry && (
        <RankCard entry={userEntry} />
      )}

      {/* Primary CTA */}
      <a
        href="/predictions"
        className="block bg-accent-primary text-white rounded-md p-3 h-12 flex items-center justify-center font-semibold hover:bg-danger transition-colors"
      >
        Make Prediction
      </a>

      {/* Match Progress */}
      <div className="bg-surface rounded-md border border-border p-3">
        <p className="text-sm text-text-secondary">
          {finished} of {total} matches completed
        </p>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-3">Standings</h2>
        <LeaderboardTable entries={leaderboard || []} />
      </div>
    </div>
  )
}
