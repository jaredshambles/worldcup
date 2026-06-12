'use client'

import { useState } from 'react'
import type { Profile, Match, Prediction } from '@/lib/types'

export function H2HClient({
  userId,
  profiles,
  matches,
  allPredictions,
}: {
  userId: string
  profiles: Pick<Profile, 'id' | 'full_name' | 'nickname'>[]
  matches: Match[]
  allPredictions: Prediction[]
}) {
  const [opponentId, setOpponentId] = useState<string>('')

  const me = profiles.find(p => p.id === userId)
  const opponent = profiles.find(p => p.id === opponentId)
  const others = profiles.filter(p => p.id !== userId)

  // Compare predictions for finished matches
  const myPreds = allPredictions.filter(p => p.player_id === userId)
  const oppPreds = allPredictions.filter(p => p.player_id === opponentId)

  const comparisons = matches.map(m => {
    const myPred = myPreds.find(p => p.match_id === m.id)
    const oppPred = oppPreds.find(p => p.match_id === m.id)
    return { match: m as Match, myPred, oppPred }
  }).filter(c => c.myPred || c.oppPred)

  const myTotal = comparisons.reduce((s, c) => s + (c.myPred?.points_earned || 0), 0)
  const oppTotal = comparisons.reduce((s, c) => s + (c.oppPred?.points_earned || 0), 0)
  const myExact = comparisons.filter(c => c.myPred?.points_earned === 3).length
  const oppExact = comparisons.filter(c => c.oppPred?.points_earned === 3).length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Head-to-Head</h1>

      <div className="bg-card border border-border rounded-lg p-4">
        <label className="text-sm text-muted block mb-2">Compare with:</label>
        <select
          value={opponentId}
          onChange={e => setOpponentId(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
        >
          <option value="">Select a player...</option>
          {others.map(p => (
            <option key={p.id} value={p.id}>
              {p.nickname || p.full_name}
            </option>
          ))}
        </select>
      </div>

      {opponent && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-xs text-muted mb-1">{me?.nickname || me?.full_name || 'You'}</div>
              <div className={`text-2xl font-bold ${myTotal > oppTotal ? 'text-accent' : ''}`}>{myTotal}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-xs text-muted mb-1">Matches</div>
              <div className="text-2xl font-bold">{comparisons.length}</div>
              <div className="text-xs text-muted mt-1">Exact: {myExact} vs {oppExact}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-xs text-muted mb-1">{opponent.nickname || opponent.full_name}</div>
              <div className={`text-2xl font-bold ${oppTotal > myTotal ? 'text-accent' : ''}`}>{oppTotal}</div>
            </div>
          </div>

          {/* Match-by-match */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 px-4 py-2 bg-card-hover text-xs text-muted font-semibold">
              <span>Your Pick</span>
              <span className="text-center">Result</span>
              <span className="text-right">Their Pick</span>
            </div>
            <div className="divide-y divide-border/50">
              {comparisons.map(({ match: m, myPred, oppPred }) => (
                <div key={m.id} className="grid grid-cols-[1fr_auto_1fr] gap-2 px-4 py-2 text-sm items-center">
                  <div>
                    {myPred ? (
                      <span className={
                        myPred.points_earned === 3 ? 'text-gold font-bold' :
                        myPred.points_earned === 1 ? 'text-accent' : 'text-muted'
                      }>
                        {myPred.predicted_home}-{myPred.predicted_away}
                        <span className="text-xs ml-1">({myPred.points_earned})</span>
                      </span>
                    ) : <span className="text-muted text-xs">No pick</span>}
                  </div>
                  <div className="text-center text-xs px-2">
                    <div className="font-medium">{m.home_team} {m.home_score}-{m.away_score} {m.away_team}</div>
                  </div>
                  <div className="text-right">
                    {oppPred ? (
                      <span className={
                        oppPred.points_earned === 3 ? 'text-gold font-bold' :
                        oppPred.points_earned === 1 ? 'text-accent' : 'text-muted'
                      }>
                        <span className="text-xs mr-1">({oppPred.points_earned})</span>
                        {oppPred.predicted_home}-{oppPred.predicted_away}
                      </span>
                    ) : <span className="text-muted text-xs">No pick</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
