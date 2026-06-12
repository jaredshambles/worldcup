import { createClient } from '@/lib/supabase/server'
import { LeaderboardTable } from '@/components/LeaderboardTable'
import { RankCard } from '@/components/RankCard'
import { DeadlineBanner } from '@/components/DeadlineBanner'
import { PullToRefresh } from '@/components/PullToRefresh'
import { HomeContent } from './HomeContent'

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
    <PullToRefresh onRefresh={async () => {
      // Revalidate the page data
      // In a real app, you'd call an API to refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
    }}>
      <HomeContent
        leaderboard={leaderboard || []}
        deadlines={deadlines || []}
        userEntry={userEntry}
        finished={finished}
        total={total}
      />
    </PullToRefresh>
  )
}
