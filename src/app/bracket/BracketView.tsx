'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { STAGE_LABELS, getTeamFlag } from '@/lib/types'
import type { Match } from '@/lib/types'

interface BracketViewProps {
  knockoutMatches: Match[]
  groupStandings: Record<string, { team: string; pts: number; gd: number; gf: number }[]>
}

function formatMatchTime(date: Date): string {
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  })
  return timeFormatter.format(date)
}

export function BracketView({ knockoutMatches, groupStandings }: BracketViewProps) {
  const [view, setView] = useState<'group' | 'knockout'>('group')

  const groupMatches = knockoutMatches.filter(m => m.stage === 'group')
  const knockoutMatches_filtered = knockoutMatches.filter(m => m.stage !== 'group')

  if (view === 'group') {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setView('group')}
          >
            Group Standings
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setView('knockout')}
          >
            Knockout Bracket
          </Button>
        </div>

        {/* Group Standings */}
        <div className="space-y-4">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(group => {
            const groupTeams = groupStandings[group] || []

            return (
              <Card key={group} variant="default" className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  Group {group}
                </h3>
                <div className="space-y-2">
                  {groupTeams.length > 0 ? (
                    groupTeams.map(team => (
                      <div
                        key={team.team}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-text-primary">{getTeamFlag(team.team)} {team.team}</span>
                        <span className="text-text-secondary">{team.pts} pts</span>
                      </div>
                    ))
                  ) : (
                    ['Team 1', 'Team 2', 'Team 3', 'Team 4'].map((placeholder, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-text-secondary">{placeholder}</span>
                        <span className="text-text-secondary">0 pts</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Knockout view
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => setView('group')}
        >
          Group Standings
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setView('knockout')}
        >
          Knockout Bracket
        </Button>
      </div>

      {/* Knockout Matches */}
      <div className="space-y-4">
        {knockoutMatches_filtered.map(match => {
          const matchDateTime = match.match_date && match.match_time
            ? new Date(`${match.match_date}T${match.match_time}`)
            : null

          const formattedTime = matchDateTime ? formatMatchTime(matchDateTime) : null

          return (
            <Card key={match.id} variant="default" className="space-y-2">
              <p className="text-xs text-text-secondary uppercase font-medium">
                {STAGE_LABELS[match.stage]}
              </p>
              {formattedTime && (
                <p className="text-xs text-text-secondary">
                  {formattedTime}
                </p>
              )}
              <div className="space-y-1">
                <p className="text-sm text-text-primary">{getTeamFlag(match.home_team)} {match.home_team || 'TBD'}</p>
                <p className="text-sm text-text-secondary">{getTeamFlag(match.away_team)} {match.away_team || 'TBD'}</p>
              </div>
              {match.status === 'finished' && (
                <p className="text-sm font-semibold text-success">
                  {match.home_score}-{match.away_score}
                </p>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
