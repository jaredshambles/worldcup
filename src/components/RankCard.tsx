'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import type { LeaderboardEntry } from '@/lib/types'

export function RankCard({ entry }: { entry: LeaderboardEntry }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      role="region"
      aria-label={`Your current rank: #${entry.rank} with ${entry.total_points} points`}
      variant="highlight"
      interactive
      onClick={() => setExpanded(!expanded)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setExpanded(!expanded)
        }
      }}
      tabIndex={0}
    >
      <div className="text-center space-y-2">
        {/* Rank Number - Hero Size */}
        <div className="text-rank-hero font-light leading-none" aria-label={`Rank ${entry.rank}`}>
          #{entry.rank}
        </div>

        {/* Label */}
        <p className="text-xs uppercase tracking-wide font-medium text-text-secondary">
          Your Position
        </p>

        {/* Name & Points */}
        <p className="text-sm font-medium text-text-primary">
          {entry.nickname || entry.full_name}
        </p>
        <p className="text-lg font-semibold text-text-primary">
          {entry.total_points} pts
        </p>

        {/* Gap from leader */}
        {entry.rank > 1 && (
          <p className="text-sm font-medium text-danger">
            📍 {Math.max(0, entry.total_points - 245)} pts from 1st
          </p>
        )}
      </div>

      {/* Expanded Breakdown */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-highlight-border space-y-3" role="region" aria-label="Points breakdown by stage">
          <h3 className="text-xs uppercase tracking-wide font-medium text-text-secondary">
            Stage Breakdown
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Group', pts: entry.group_points },
              { label: 'R32', pts: entry.r32_points },
              { label: 'R16', pts: entry.r16_points },
              { label: 'QF', pts: entry.qf_points },
              { label: 'SF', pts: entry.sf_points },
              { label: 'Final', pts: entry.final_points },
            ].map(stage => (
              <div key={stage.label}>
                <p className="text-xs text-text-secondary">{stage.label}</p>
                <p className="text-sm font-semibold text-text-primary">{stage.pts}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
