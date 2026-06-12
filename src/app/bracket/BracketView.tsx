'use client'

import { useState } from 'react'
import { STAGE_LABELS } from '@/lib/types'
import type { Match } from '@/lib/types'

const KNOCKOUT_STAGES = ['r32', 'r16', 'qf', 'sf', 'third', 'final']

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'

  return (
    <div className={`bg-card border rounded-lg p-2 text-xs w-full ${
      isLive ? 'border-danger' : 'border-border'
    }`}>
      <div className="flex justify-between items-center">
        <span className="text-muted">M{match.match_number}</span>
        {isLive && <span className="text-danger font-bold animate-pulse">LIVE</span>}
        {isFinished && <span className="text-accent text-xs">FT</span>}
      </div>
      <div className="mt-1 space-y-0.5">
        <div className="flex justify-between">
          <span className={`truncate ${isFinished && match.home_score! > match.away_score! ? 'font-bold text-accent' : ''}`}>
            {match.home_team}
          </span>
          {isFinished && <span className="font-bold ml-1">{match.home_score}</span>}
        </div>
        <div className="flex justify-between">
          <span className={`truncate ${isFinished && match.away_score! > match.home_score! ? 'font-bold text-accent' : ''}`}>
            {match.away_team}
          </span>
          {isFinished && <span className="font-bold ml-1">{match.away_score}</span>}
        </div>
      </div>
      <div className="text-muted mt-1 text-[10px]">{match.match_date} {match.match_time}</div>
    </div>
  )
}

export function BracketView({
  knockoutMatches,
  groupStandings,
}: {
  knockoutMatches: Match[]
  groupStandings: Record<string, { team: string; pts: number; gd: number; gf: number }[]>
}) {
  const [view, setView] = useState<'groups' | 'knockout'>('knockout')

  const byStage: Record<string, Match[]> = {}
  for (const m of knockoutMatches) {
    if (!byStage[m.stage]) byStage[m.stage] = []
    byStage[m.stage].push(m)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bracket</h1>
        <div className="flex bg-card border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setView('groups')}
            className={`px-3 py-1.5 text-sm ${view === 'groups' ? 'bg-accent text-background font-semibold' : 'text-muted'}`}
          >
            Groups
          </button>
          <button
            onClick={() => setView('knockout')}
            className={`px-3 py-1.5 text-sm ${view === 'knockout' ? 'bg-accent text-background font-semibold' : 'text-muted'}`}
          >
            Knockout
          </button>
        </div>
      </div>

      {view === 'groups' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupStandings).sort(([a], [b]) => a.localeCompare(b)).map(([letter, teams]) => (
            <div key={letter} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-card-hover text-xs font-semibold uppercase tracking-wide">
                Group {letter}
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-muted">
                    <th className="text-left px-3 py-1">#</th>
                    <th className="text-left px-3 py-1">Team</th>
                    <th className="text-center px-2 py-1">Pts</th>
                    <th className="text-center px-2 py-1">GD</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((t, i) => (
                    <tr key={t.team} className={`border-t border-border/50 ${i < 2 ? 'text-accent' : i === 2 ? 'text-gold' : 'text-muted'}`}>
                      <td className="px-3 py-1.5">{i + 1}</td>
                      <td className="px-3 py-1.5 font-medium">{t.team}</td>
                      <td className="text-center px-2 py-1.5 font-bold">{t.pts}</td>
                      <td className="text-center px-2 py-1.5">{t.gd > 0 ? `+${t.gd}` : t.gd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {view === 'knockout' && (
        <div className="space-y-6 overflow-x-auto">
          {KNOCKOUT_STAGES.filter(s => byStage[s]?.length).map(stage => (
            <div key={stage}>
              <h2 className="font-semibold text-sm text-muted mb-2">{STAGE_LABELS[stage]}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {byStage[stage].map(m => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
