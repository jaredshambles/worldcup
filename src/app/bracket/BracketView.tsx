'use client'

import { useState } from 'react'
import { STAGE_LABELS, formatTeamName } from '@/lib/types'
import type { Match } from '@/lib/types'

const KNOCKOUT_STAGES = ['r32', 'r16', 'qf', 'sf', 'third', 'final']
const STAGE_CONFIG: Record<string, { width: number; matchesPerColumn: number }> = {
  r32: { width: 140, matchesPerColumn: 16 },
  r16: { width: 140, matchesPerColumn: 8 },
  qf: { width: 140, matchesPerColumn: 4 },
  sf: { width: 140, matchesPerColumn: 2 },
  third: { width: 140, matchesPerColumn: 1 },
  final: { width: 140, matchesPerColumn: 1 },
}

function resolveTeamName(seed: string, groupStandings: Record<string, { team: string; pts: number; gd: number; gf: number }[]>): string {
  if (seed === 'TBD') return 'TBD'
  const match = seed.match(/^(\d+)(?:st|nd|rd|th)?\s*([A-L])(.*)$/)
  if (!match) return seed
  const [, numStr, group, rest] = match
  const position = parseInt(numStr) - 1
  const teams = groupStandings[group]
  if (!teams || position >= teams.length) {
    return formatTeamName(seed)
  }
  return teams[position].team
}

function MatchCard({
  match,
  groupStandings,
}: {
  match: Match
  groupStandings: Record<string, { team: string; pts: number; gd: number; gf: number }[]>
}) {
  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'
  const homeTeam = resolveTeamName(match.home_team, groupStandings)
  const awayTeam = resolveTeamName(match.away_team, groupStandings)

  return (
    <div className={`bg-card border rounded p-1.5 text-[11px] w-full h-fit ${
      isLive ? 'border-danger' : 'border-border'
    }`}>
      <div className="flex justify-between items-center gap-1">
        <span className="text-muted text-[10px] shrink-0">M{match.match_number}</span>
        {isLive && <span className="text-danger font-bold text-[10px] shrink-0">●</span>}
        {isFinished && <span className="text-accent text-[10px] shrink-0">✓</span>}
      </div>
      <div className="mt-0.5 space-y-0.5">
        <div className="flex justify-between gap-1 items-start">
          <span className={`truncate flex-1 ${isFinished && match.home_score! > match.away_score! ? 'font-bold text-accent' : ''}`}>
            {homeTeam}
          </span>
          {isFinished && <span className="font-bold shrink-0">{match.home_score}</span>}
        </div>
        <div className="flex justify-between gap-1 items-start">
          <span className={`truncate flex-1 ${isFinished && match.away_score! > match.home_score! ? 'font-bold text-accent' : ''}`}>
            {awayTeam}
          </span>
          {isFinished && <span className="font-bold shrink-0">{match.away_score}</span>}
        </div>
      </div>
    </div>
  )
}

function BracketConnector({ stageHeight, matchHeight }: { stageHeight: number; matchHeight: number }) {
  return (
    <svg
      width="20"
      height={stageHeight}
      className="absolute -right-10 top-0"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <style>{`
          .connector-line { stroke: var(--border); stroke-width: 1; fill: none; }
        `}</style>
      </defs>
      {/* Draw connecting lines from left stage to right stage */}
    </svg>
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

  const activeStages = KNOCKOUT_STAGES.filter(s => byStage[s]?.length)

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
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-0 min-w-max px-4 py-4 relative">
            {activeStages.map((stage, stageIdx) => {
              const matches = byStage[stage]
              const matchHeight = 90
              const gap = 8
              const totalHeight = matches.length * matchHeight + (matches.length - 1) * gap
              const nextStage = stageIdx < activeStages.length - 1 ? activeStages[stageIdx + 1] : null
              const nextMatches = nextStage ? byStage[nextStage] : []

              return (
                <div key={stage} className="flex relative">
                  <div className="flex flex-col pr-6">
                    <h2 className="font-semibold text-sm text-muted mb-3 h-6">{STAGE_LABELS[stage]}</h2>
                    <div
                      className="relative"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: `${gap}px`,
                        minWidth: `${STAGE_CONFIG[stage].width}px`,
                        minHeight: `${totalHeight}px`,
                      }}
                    >
                      {matches.map((m) => (
                        <MatchCard key={m.id} match={m} groupStandings={groupStandings} />
                      ))}
                    </div>
                  </div>

                  {nextStage && nextMatches.length > 0 && (
                    <svg
                      width="24"
                      height={Math.max(totalHeight, nextMatches.length * matchHeight + (nextMatches.length - 1) * gap)}
                      style={{ position: 'absolute', right: '-24px', top: '38px' }}
                      className="overflow-visible"
                    >
                      <defs>
                        <style>{`.bracket-line { stroke: var(--border); stroke-width: 1; fill: none; }`}</style>
                      </defs>
                      {matches.map((m, idx) => {
                        const fromY = 38 + idx * (matchHeight + gap) + matchHeight / 2
                        const nextIdx1 = idx * 2
                        const nextIdx2 = idx * 2 + 1
                        const toY1 = Math.min(nextIdx1, nextMatches.length - 1) * (matchHeight + gap) + matchHeight / 2
                        const toY2 = Math.min(nextIdx2, nextMatches.length - 1) * (matchHeight + gap) + matchHeight / 2
                        const midX = 12

                        return (
                          <g key={`${stage}-${idx}`}>
                            {nextIdx1 < nextMatches.length && (
                              <>
                                <line x1="0" y1={fromY} x2={midX} y2={fromY} className="bracket-line" />
                                <line x1={midX} y1={Math.min(fromY, toY1)} x2={midX} y2={Math.max(fromY, toY1)} className="bracket-line" />
                                <line x1={midX} y1={toY1} x2="24" y2={toY1} className="bracket-line" />
                              </>
                            )}
                            {nextIdx2 < nextMatches.length && (
                              <>
                                <line x1="0" y1={fromY} x2={midX} y2={fromY} className="bracket-line" />
                                <line x1={midX} y1={Math.min(fromY, toY2)} x2={midX} y2={Math.max(fromY, toY2)} className="bracket-line" />
                                <line x1={midX} y1={toY2} x2="24" y2={toY2} className="bracket-line" />
                              </>
                            )}
                          </g>
                        )
                      })}
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
