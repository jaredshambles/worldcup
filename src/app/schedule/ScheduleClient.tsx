'use client'

import { useState } from 'react'
import { TimezoneSelector } from '@/components/TimezoneSelector'
import { useTimezone, formatTimeInTimezone, TIMEZONES } from '@/lib/useTimezone'
import { STAGE_LABELS, formatTeamName, getTeamFlag } from '@/lib/types'
import type { Match } from '@/lib/types'

function StatusBadge({ status }: { status: string }) {
  if (status === 'live') return <span className="text-xs px-1.5 py-0.5 bg-danger/20 text-danger rounded font-semibold animate-pulse">LIVE</span>
  if (status === 'finished') return <span className="text-xs px-1.5 py-0.5 bg-accent/20 text-accent rounded">FT</span>
  return null
}

export function ScheduleClient({ matches }: { matches: Match[] }) {
  const { timezone, isLoading } = useTimezone()
  const currentTz = TIMEZONES.find(tz => tz.id === timezone)

  // Group by date
  const byDate: Record<string, Match[]> = {}
  for (const m of matches) {
    if (!byDate[m.match_date]) byDate[m.match_date] = []
    byDate[m.match_date].push(m)
  }

  const today = new Date().toISOString().split('T')[0]

  if (isLoading) {
    return <div className="text-muted">Loading schedule...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Match Schedule</h1>
          <p className="text-xs text-muted mt-1">Times shown in {currentTz?.label}</p>
        </div>
        <TimezoneSelector />
      </div>

      <div className="flex gap-2 text-xs text-muted">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-accent rounded-full" /> Finished
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-danger rounded-full animate-pulse" /> Live
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-muted rounded-full" /> Scheduled
        </span>
      </div>

      {Object.entries(byDate).map(([date, dayMatches]) => {
        const isToday = date === today
        const dateObj = new Date(date + 'T12:00:00')
        const formatted = dateObj.toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric',
        })

        return (
          <div key={date} className="space-y-1">
            <div className={`flex items-center gap-2 sticky top-14 z-10 py-2`}
              style={{ backgroundColor: 'var(--background)' }}
            >
              <h2 className="font-semibold text-sm">{formatted}</h2>
              {isToday && (
                <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full font-semibold">Today</span>
              )}
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden divide-y divide-border/50">
              {dayMatches.map(m => (
                <div key={m.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <div className="text-xs text-muted shrink-0">
                    <div className="font-medium">{formatTimeInTimezone(m.match_time, timezone)}</div>
                    <div className="text-xs text-muted/70">{timezone.split('/')[1]?.replace(/_/g, ' ') || timezone}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`truncate ${m.status === 'finished' && m.home_score !== null && m.away_score !== null && m.home_score > m.away_score ? 'font-bold' : 'font-medium'}`}>{getTeamFlag(m.home_team)} {formatTeamName(m.home_team)}</span>
                      {m.status === 'finished' ? (
                        <span className="text-accent font-bold shrink-0">{m.home_score} - {m.away_score}</span>
                      ) : (
                        <span className="text-muted shrink-0">vs</span>
                      )}
                      <span className={`truncate ${m.status === 'finished' && m.home_score !== null && m.away_score !== null && m.away_score > m.home_score ? 'font-bold' : 'font-medium'}`}>{getTeamFlag(m.away_team)} {formatTeamName(m.away_team)}</span>
                      <StatusBadge status={m.status} />
                    </div>
                    <div className="text-xs text-muted">
                      {STAGE_LABELS[m.stage] || m.stage}
                      {m.group_letter && ` - Group ${m.group_letter}`}
                      {' '}| Match {m.match_number}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
