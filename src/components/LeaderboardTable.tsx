'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { LeaderboardEntry } from '@/lib/types'

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>
  if (rank === 2) return <span className="text-lg">🥈</span>
  if (rank === 3) return <span className="text-lg">🥉</span>
  return <span className="text-sm text-text-secondary w-6 text-center">{rank}</span>
}

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!entries.length) {
    return <p className="text-text-secondary text-center py-6">No predictions submitted yet.</p>
  }

  return (
    <div
      role="table"
      aria-label="Live leaderboard with player rankings"
      className="bg-white rounded-md border border-border overflow-hidden"
    >
      {/* Header - Mobile: minimal, Desktop: full */}
      <div
        role="row"
        className="grid grid-cols-[40px_1fr_60px] sm:grid-cols-[50px_1fr_70px_70px_70px_80px] gap-2 px-3 py-2 bg-surface-hover text-xs text-text-secondary font-semibold uppercase tracking-wide"
      >
        <span role="columnheader">Rank</span>
        <span role="columnheader">Player</span>
        <span role="columnheader" className="text-right sm:text-center">Total</span>
        <span role="columnheader" className="hidden sm:block text-center">Exact</span>
        <span role="columnheader" className="hidden sm:block text-center">Winner</span>
        <span role="columnheader" className="hidden sm:block text-center">Bonus</span>
      </div>

      {/* Rows */}
      {entries.map(entry => (
        <div key={entry.player_id} role="row">
          <button
            onClick={() => setExpanded(expanded === entry.player_id ? null : entry.player_id)}
            aria-expanded={expanded === entry.player_id}
            aria-label={`${entry.nickname || entry.full_name} - Rank ${entry.rank} with ${entry.total_points} total points`}
            className="grid grid-cols-[40px_1fr_60px] sm:grid-cols-[50px_1fr_70px_70px_70px_80px] gap-2 px-3 py-3 w-full text-left hover:bg-surface-hover active:bg-surface-hover transition-colors border-t border-border"
          >
            <span className="flex items-center">
              <RankMedal rank={entry.rank} />
            </span>
            <span className="flex items-center gap-2 min-w-0">
              <span className="truncate font-medium text-sm sm:text-base text-text-primary">
                {entry.nickname || entry.full_name}
              </span>
            </span>
            <span className="text-right sm:text-center font-bold text-base text-text-primary">{entry.total_points}</span>
            <span className="hidden sm:block text-center text-warning font-semibold text-sm">{entry.exact_scores}</span>
            <span className="hidden sm:block text-center text-accent-secondary font-semibold text-sm">{entry.correct_winners}</span>
            <span className="hidden sm:block text-center text-text-secondary text-sm">{entry.bonus_points}</span>
          </button>

          {/* Expanded breakdown - shows all columns on mobile, plus stage breakdown */}
          {expanded === entry.player_id && (
            <div
              role="region"
              aria-label={`Score breakdown for ${entry.nickname || entry.full_name}`}
              className="px-3 pb-3 bg-surface-hover border-t border-border space-y-3"
            >
              {/* Mobile: show hidden columns in expanded view */}
              <div className="sm:hidden grid grid-cols-3 gap-3 py-3 text-xs border-b border-border pb-3">
                <div className="text-center">
                  <div className="text-text-secondary text-xs">Exact</div>
                  <div className="font-bold text-sm text-warning">{entry.exact_scores}</div>
                </div>
                <div className="text-center">
                  <div className="text-text-secondary text-xs">Winner</div>
                  <div className="font-bold text-sm text-accent-secondary">{entry.correct_winners}</div>
                </div>
                <div className="text-center">
                  <div className="text-text-secondary text-xs">Bonus</div>
                  <div className="font-bold text-sm">{entry.bonus_points}</div>
                </div>
              </div>

              {/* Stage breakdown */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 py-3 text-xs">
                {[
                  { label: 'Group', pts: entry.group_points },
                  { label: 'R32', pts: entry.r32_points },
                  { label: 'R16', pts: entry.r16_points },
                  { label: 'QF', pts: entry.qf_points },
                  { label: 'SF', pts: entry.sf_points },
                  { label: 'Final', pts: entry.final_points },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-text-secondary">{s.label}</div>
                    <div className="font-bold text-sm text-text-primary">{s.pts}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-text-secondary">
                {entry.total_predictions} predictions submitted | Match pts: {entry.match_points} + Bonus: {entry.bonus_points}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
