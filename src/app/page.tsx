import { createClient } from '@/lib/supabase/server'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { DeadlineBanner } from '@/components/DeadlineBanner'

export const revalidate = 30

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: leaderboard }, { data: deadlines }, { data: matchStats }] = await Promise.all([
    supabase.from('leaderboard').select('*'),
    supabase.from('deadlines').select('*').order('deadline_utc'),
    supabase.from('matches').select('status'),
  ])

  const finished = matchStats?.filter(m => m.status === 'finished').length || 0
  const total = matchStats?.length || 104

  return (
    <div className="space-y-6">
      <DeadlineBanner deadlines={deadlines || []} />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-accent">WC 2026</span> Bracket Challenge
          </h1>
          <p className="text-muted text-sm mt-1">
            {finished} of {total} matches completed
          </p>
        </div>
        <div className="flex gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gold inline-block" /> Exact Score (3pts)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" /> Correct Winner (1pt)
          </span>
        </div>
      </div>

      <LeaderboardTable entries={leaderboard || []} />
    </div>
  )
}
