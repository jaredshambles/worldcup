'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { LeaderboardEntry } from '@/lib/types'

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-gold text-lg">&#127942;</span>
  if (rank === 2) return <span className="text-silver text-lg">&#129352;</span>
  if (rank === 3) return <span className="text-bronze text-lg">&#129353;</span>
  return <span className="text-muted text-sm w-6 text-center inline-block">{rank}</span>
}

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!entries.length) {
    return <p className="text-muted text-center py-12">No predictions submitted yet.</p>
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_60px_60px_60px_70px] sm:grid-cols-[50px_1fr_70px_70px_70px_80px] gap-2 px-4 py-2 bg-card-hover text-xs text-muted font-semibold uppercase tracking-wide">
        <span>#</span>
        <span>Player</span>
        <span className="text-center">Exact</span>
        <span className="text-center">Winner</span>
        <span className="text-center">Bonus</span>
        <span className="text-right">Total</span>
      </div>

      {/* Rows */}
      {entries.map(entry => (
        <div key={entry.player_id}>
          <button
            onClick={() => setExpanded(expanded === entry.player_id ? null : entry.player_id)}
            className="grid grid-cols-[40px_1fr_60px_60px_60px_70px] sm:grid-cols-[50px_1fr_70px_70px_70px_80px] gap-2 px-4 py-3 w-full text-left hover:bg-card-hover transition-colors border-t border-border"
          >
            <span className="flex items-center">
              <RankBadge rank={entry.rank} />
            </span>
            <span className="flex items-center gap-2 min-w-0">
              <span className="truncate font-medium text-sm">
                {entry.nickname || entry.full_name}
              </span>
            </span>
            <span className="text-center text-gold font-semibold text-sm">{entry.exact_scores}</span>
            <span className="text-center text-accent font-semibold text-sm">{entry.correct_winners}</span>
            <span className="text-center text-muted text-sm">{entry.bonus_points}</span>
            <span className="text-right font-bold text-base">{entry.total_points}</span>
          </button>

          {/* Expanded breakdown */}
          {expanded === entry.player_id && (
            <div className="px-4 pb-3 bg-card-hover/50 border-t border-border">
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
                    <div className="text-muted">{s.label}</div>
                    <div className="font-bold text-sm">{s.pts}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted">
                {entry.total_predictions} predictions submitted | Match pts: {entry.match_points} + Bonus: {entry.bonus_points}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
