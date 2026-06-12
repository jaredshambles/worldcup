'use client'

import { LeaderboardTable } from '@/components/LeaderboardTable'
import { RankCard } from '@/components/RankCard'
import { DeadlineBanner } from '@/components/DeadlineBanner'

interface HomeContentProps {
  leaderboard: any[]
  deadlines: any[]
  userEntry: any
  finished: number
  total: number
}

export function HomeContent({
  leaderboard,
  deadlines,
  userEntry,
  finished,
  total,
}: HomeContentProps) {
  return (
    <div className="space-y-6 pb-6">
      <DeadlineBanner deadlines={deadlines} />

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
        <LeaderboardTable entries={leaderboard} />
      </div>
    </div>
  )
}
