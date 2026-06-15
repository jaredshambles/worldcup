'use client'

import { useState } from 'react'
import { DeadlineBanner } from '@/components/DeadlineBanner'
import { getTeamFlag } from '@/lib/types'
import type { LeaderboardEntry } from '@/lib/types'

interface PlayerPrediction {
  player_id: string
  predicted_home: number
  predicted_away: number
  points_earned: number
  matches: {
    match_number: number
    home_team: string
    away_team: string
    home_score: number
    away_score: number
    status: string
    group_letter: string | null
    stage: string
  }
}

interface HomeContentProps {
  leaderboard: LeaderboardEntry[]
  deadlines: any[]
  userEntry: LeaderboardEntry | null
  leaderPts: number
  finished: number
  total: number
  predictionsByPlayer: Record<string, PlayerPrediction[]>
}

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>
  if (rank === 2) return <span className="text-2xl">🥈</span>
  if (rank === 3) return <span className="text-2xl">🥉</span>
  return <span className="text-lg text-muted font-bold">#{rank}</span>
}

function PointsBadge({ points }: { points: number }) {
  if (points === 3) return <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-semibold">+3 Exact</span>
  if (points === 1) return <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-semibold">+1 Winner</span>
  return <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold">+0</span>
}

function PredictionBreakdown({ predictions }: { predictions: PlayerPrediction[] }) {
  const sorted = [...predictions].sort((a, b) => a.matches.match_number - b.matches.match_number)

  return (
    <div className="px-4 pb-3 space-y-1">
      {sorted.map(p => (
        <div key={p.matches.match_number} className="flex items-center gap-2 text-xs py-1.5 border-t border-border/30 first:border-t-0">
          <span className="text-muted w-5 shrink-0">#{p.matches.match_number}</span>
          <div className="flex-1 min-w-0">
            <span>{getTeamFlag(p.matches.home_team)} {p.matches.home_team} {p.matches.home_score}-{p.matches.away_score} {p.matches.away_team} {getTeamFlag(p.matches.away_team)}</span>
          </div>
          <span className="text-muted shrink-0">
            ({p.predicted_home}-{p.predicted_away})
          </span>
          <PointsBadge points={p.points_earned} />
        </div>
      ))}
      {predictions.length === 0 && (
        <div className="text-xs text-muted py-2">No predictions submitted yet</div>
      )}
    </div>
  )
}

function ExpandableRow({
  entry,
  predictions,
  isHighlighted,
  children,
}: {
  entry: LeaderboardEntry
  predictions: PlayerPrediction[]
  isHighlighted?: boolean
  children: React.ReactNode
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left cursor-pointer ${isHighlighted ? '' : 'hover:bg-card/80'} transition-colors`}
      >
        {children}
      </button>
      {expanded && <PredictionBreakdown predictions={predictions} />}
    </div>
  )
}

export function HomeContent({
  leaderboard,
  deadlines,
  userEntry,
  leaderPts,
  finished,
  total,
  predictionsByPlayer,
}: HomeContentProps) {
  const top3 = leaderboard.slice(0, 3)
  const userInTop3 = userEntry ? userEntry.rank <= 3 : false

  return (
    <div className="space-y-6 pb-6">
      <DeadlineBanner deadlines={deadlines} />

      {/* Match Progress */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <span className="text-xs text-muted">{finished}/{total} matches played</span>
      </div>

      {/* Top 3 Podium */}
      <div className="space-y-2">
        {top3.map(entry => (
          <ExpandableRow
            key={entry.player_id}
            entry={entry}
            predictions={predictionsByPlayer[entry.player_id] || []}
          >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
              entry.rank === 1
                ? 'bg-[#fef9c3]/10 border-[#facc15]/30'
                : 'bg-card border-border'
            }`}>
              <RankMedal rank={entry.rank} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {entry.nickname || entry.full_name}
                </div>
                <div className="text-xs text-muted">
                  {entry.exact_scores} exact · {entry.correct_winners} correct · {entry.bonus_points} bonus
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold">{entry.total_points}</div>
                <div className="text-xs text-muted">pts</div>
              </div>
            </div>
          </ExpandableRow>
        ))}
      </div>

      {/* Your Ranking (if logged in and not already in top 3) */}
      {userEntry && !userInTop3 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted uppercase tracking-wide">Your Position</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <ExpandableRow
            entry={userEntry}
            predictions={predictionsByPlayer[userEntry.player_id] || []}
            isHighlighted
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-accent/30 bg-accent/5">
              <span className="text-lg font-bold text-accent">#{userEntry.rank}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {userEntry.nickname || userEntry.full_name}
                </div>
                <div className="text-xs text-muted">
                  {userEntry.exact_scores} exact · {userEntry.correct_winners} correct · {userEntry.bonus_points} bonus
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold">{userEntry.total_points}</div>
                <div className="text-xs text-muted">
                  {leaderPts - userEntry.total_points > 0
                    ? `${leaderPts - userEntry.total_points} behind 1st`
                    : 'pts'}
                </div>
              </div>
            </div>
          </ExpandableRow>
        </div>
      )}

      {/* If user IS in top 3, show a subtle highlight note */}
      {userEntry && userInTop3 && (
        <div className="text-center text-xs text-accent font-medium">
          You're in the top 3! Keep it up.
        </div>
      )}

      {/* Not logged in prompt */}
      {!userEntry && (
        <a
          href="/login"
          className="block text-center text-sm text-accent hover:underline py-2"
        >
          Log in to see your ranking
        </a>
      )}

      {/* Primary CTA */}
      <a
        href="/predictions"
        className="block bg-accent text-white rounded-md p-3 h-12 flex items-center justify-center font-semibold hover:opacity-90 transition-opacity"
      >
        Make Predictions
      </a>

      {/* Full Standings */}
      {leaderboard.length > 3 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide">All Players</h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden divide-y divide-border/50">
            {leaderboard.slice(3).map(entry => (
              <ExpandableRow
                key={entry.player_id}
                entry={entry}
                predictions={predictionsByPlayer[entry.player_id] || []}
                isHighlighted={!!userEntry && entry.player_id === userEntry.player_id}
              >
                <div className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                  userEntry && entry.player_id === userEntry.player_id ? 'bg-accent/5' : ''
                }`}>
                  <span className="text-xs text-muted font-bold w-6 text-center shrink-0">
                    {entry.rank}
                  </span>
                  <div className="flex-1 min-w-0 truncate font-medium">
                    {entry.nickname || entry.full_name}
                  </div>
                  <span className="text-xs text-muted shrink-0">
                    {entry.exact_scores}E · {entry.correct_winners}W
                  </span>
                  <span className="font-bold shrink-0 w-8 text-right">{entry.total_points}</span>
                </div>
              </ExpandableRow>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
