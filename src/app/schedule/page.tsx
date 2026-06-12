import { createClient } from '@/lib/supabase/server'
import { STAGE_LABELS, formatTeamName } from '@/lib/types'
import type { Match } from '@/lib/types'

export const revalidate = 60

function StatusBadge({ status }: { status: string }) {
  if (status === 'live') return <span className="text-xs px-1.5 py-0.5 bg-danger/20 text-danger rounded font-semibold animate-pulse">LIVE</span>
  if (status === 'finished') return <span className="text-xs px-1.5 py-0.5 bg-accent/20 text-accent rounded">FT</span>
  return null
}

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date')
    .order('match_time')

  const allMatches = (matches || []) as Match[]

  // Group by date
  const byDate: Record<string, Match[]> = {}
  for (const m of allMatches) {
    if (!byDate[m.match_date]) byDate[m.match_date] = []
    byDate[m.match_date].push(m)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Match Schedule</h1>

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
            <div className={`flex items-center gap-2 sticky top-14 z-10 py-2 ${isToday ? '' : ''}`}
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
                  <div className="w-12 text-xs text-muted shrink-0">{m.match_time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium truncate">{formatTeamName(m.home_team)}</span>
                      {m.status === 'finished' ? (
                        <span className="text-accent font-bold shrink-0">{m.home_score} - {m.away_score}</span>
                      ) : (
                        <span className="text-muted shrink-0">vs</span>
                      )}
                      <span className="font-medium truncate">{formatTeamName(m.away_team)}</span>
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
