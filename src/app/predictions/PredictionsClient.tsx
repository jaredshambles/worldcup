'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { STAGE_ORDER, STAGE_LABELS, formatTeamName } from '@/lib/types'
import type { Match, Prediction, Deadline, BonusQuestion, BonusAnswer } from '@/lib/types'

function isDeadlinePassed(deadlines: Deadline[], stage: string): boolean {
  const dl = deadlines.find(d => d.stage === stage)
  if (!dl) return false
  return new Date(dl.deadline_utc) < new Date()
}

function groupMatchesByStage(matches: Match[]) {
  const grouped: Record<string, Match[]> = {}
  for (const m of matches) {
    if (!grouped[m.stage]) grouped[m.stage] = []
    grouped[m.stage].push(m)
  }
  return grouped
}

interface ScoreInputProps {
  match: Match
  prediction: Prediction | undefined
  locked: boolean
  onSave: (matchId: number, home: number, away: number) => Promise<void>
}

function ScoreInput({ match, prediction, locked, onSave }: ScoreInputProps) {
  const [home, setHome] = useState(prediction?.predicted_home?.toString() ?? '')
  const [away, setAway] = useState(prediction?.predicted_away?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isFinished = match.status === 'finished'
  const isLocked = locked || prediction?.is_locked || false

  const handleSave = async () => {
    const h = parseInt(home)
    const a = parseInt(away)
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return
    setSaving(true)
    await onSave(match.id, h, a)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const pointsBadge = isFinished && prediction ? (
    <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-bold ${
      prediction.points_earned === 3 ? 'bg-gold/20 text-gold' :
      prediction.points_earned === 1 ? 'bg-accent/20 text-accent' :
      'bg-danger/20 text-danger'
    }`}>
      {prediction.points_earned === 3 ? '+3' : prediction.points_earned === 1 ? '+1' : '0'}
    </span>
  ) : null

  return (
    <div className={`flex items-center gap-2 py-2 px-3 rounded text-xs ${
      isFinished ? 'bg-card-hover/30' : ''
    }`}>
      <div className="flex-1 min-w-0">
        <span className="truncate">{formatTeamName(match.home_team)}</span>
        {isFinished && (
          <span className="text-xs text-muted ml-1">({match.home_score}-{match.away_score})</span>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <input
          type="number"
          min={0}
          max={20}
          value={home}
          onChange={e => setHome(e.target.value)}
          disabled={isLocked || isFinished}
          className="w-10 h-8 text-center bg-background border border-border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="text-muted text-xs">-</span>
        <input
          type="number"
          min={0}
          max={20}
          value={away}
          onChange={e => setAway(e.target.value)}
          disabled={isLocked || isFinished}
          className="w-10 h-8 text-center bg-background border border-border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex-1 min-w-0 text-right">
        <span className="truncate">{formatTeamName(match.away_team)}</span>
      </div>

      <div className="w-16 shrink-0 text-right">
        {isFinished ? (
          pointsBadge
        ) : isLocked ? (
          <span className="text-xs text-muted">Locked</span>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving || !home || !away}
            className={`text-xs px-2 py-1 rounded font-semibold transition-colors ${
              saved
                ? 'bg-accent/20 text-accent'
                : 'bg-accent text-background hover:bg-accent-dim disabled:opacity-40'
            }`}
          >
            {saving ? '...' : saved ? 'Saved' : prediction ? 'Update' : 'Save'}
          </button>
        )}
      </div>
    </div>
  )
}

export function PredictionsClient({
  userId,
  matches,
  predictions: initialPredictions,
  deadlines,
  bonusQuestions,
  bonusAnswers: initialBonusAnswers,
}: {
  userId: string
  matches: Match[]
  predictions: Prediction[]
  deadlines: Deadline[]
  bonusQuestions: BonusQuestion[]
  bonusAnswers: BonusAnswer[]
}) {
  const [predictions, setPredictions] = useState(initialPredictions)
  const [bonusAnswers, setBonusAnswers] = useState(initialBonusAnswers)
  const [activeStage, setActiveStage] = useState<string>('group')
  const [bonusInputs, setBonusInputs] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {}
    initialBonusAnswers.forEach(a => { map[a.question_id] = a.answer_text })
    return map
  })

  const supabase = createClient()
  const grouped = groupMatchesByStage(matches)

  const handleSavePrediction = async (matchId: number, home: number, away: number) => {
    const existing = predictions.find(p => p.match_id === matchId)

    if (existing) {
      const { data } = await supabase
        .from('predictions')
        .update({ predicted_home: home, predicted_away: away })
        .eq('id', existing.id)
        .select()
        .single()
      if (data) {
        setPredictions(prev => prev.map(p => p.id === existing.id ? data as Prediction : p))
      }
    } else {
      const { data } = await supabase
        .from('predictions')
        .insert({ player_id: userId, match_id: matchId, predicted_home: home, predicted_away: away })
        .select()
        .single()
      if (data) {
        setPredictions(prev => [...prev, data as Prediction])
      }
    }
  }

  const handleSaveBonus = async (questionId: number) => {
    const text = bonusInputs[questionId]?.trim()
    if (!text) return
    const existing = bonusAnswers.find(a => a.question_id === questionId)

    if (existing) {
      const { data } = await supabase
        .from('bonus_answers')
        .update({ answer_text: text })
        .eq('id', existing.id)
        .select()
        .single()
      if (data) {
        setBonusAnswers(prev => prev.map(a => a.id === existing.id ? data as BonusAnswer : a))
      }
    } else {
      const { data } = await supabase
        .from('bonus_answers')
        .insert({ player_id: userId, question_id: questionId, answer_text: text })
        .select()
        .single()
      if (data) {
        setBonusAnswers(prev => [...prev, data as BonusAnswer])
      }
    }
  }

  const stagesWithMatches = STAGE_ORDER.filter(s => grouped[s]?.length)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Predictions</h1>

      {/* Stage tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {stagesWithMatches.map(stage => {
          const locked = isDeadlinePassed(deadlines, stage)
          const stageMatches = grouped[stage] || []
          const stagePreds = predictions.filter(p => stageMatches.some(m => m.id === p.match_id))
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors ${
                activeStage === stage
                  ? 'bg-accent text-background font-semibold'
                  : 'bg-card text-muted hover:text-foreground'
              }`}
            >
              {STAGE_LABELS[stage]}
              <span className="ml-1 text-xs opacity-70">
                {stagePreds.length}/{stageMatches.length}
              </span>
              {locked && <span className="ml-1 text-xs">&#128274;</span>}
            </button>
          )
        })}
        <button
          onClick={() => setActiveStage('bonus')}
          className={`px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors ${
            activeStage === 'bonus'
              ? 'bg-accent text-background font-semibold'
              : 'bg-card text-muted hover:text-foreground'
          }`}
        >
          Bonus
        </button>
      </div>

      {/* Match predictions */}
      {activeStage !== 'bonus' && grouped[activeStage] && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {isDeadlinePassed(deadlines, activeStage) && (
            <div className="px-4 py-2 bg-danger/10 border-b border-danger/20 text-xs text-danger">
              Deadline passed -- predictions for this stage are locked.
            </div>
          )}

          {/* Group by group letter for group stage */}
          {activeStage === 'group' ? (
            (() => {
              const byGroup: Record<string, Match[]> = {}
              for (const m of grouped['group']) {
                const g = m.group_letter || '?'
                if (!byGroup[g]) byGroup[g] = []
                byGroup[g].push(m)
              }
              return Object.entries(byGroup).sort(([a], [b]) => a.localeCompare(b)).map(([letter, groupMatches]) => (
                <div key={letter}>
                  <div className="px-4 py-2 bg-card-hover text-xs font-semibold text-muted uppercase tracking-wide border-b border-border">
                    Group {letter}
                  </div>
                  <div className="divide-y divide-border/50">
                    {groupMatches.map(m => (
                      <ScoreInput
                        key={m.id}
                        match={m}
                        prediction={predictions.find(p => p.match_id === m.id)}
                        locked={isDeadlinePassed(deadlines, activeStage)}
                        onSave={handleSavePrediction}
                      />
                    ))}
                  </div>
                </div>
              ))
            })()
          ) : (
            <div className="divide-y divide-border/50">
              {grouped[activeStage].map(m => (
                <ScoreInput
                  key={m.id}
                  match={m}
                  prediction={predictions.find(p => p.match_id === m.id)}
                  locked={isDeadlinePassed(deadlines, activeStage)}
                  onSave={handleSavePrediction}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bonus questions */}
      {activeStage === 'bonus' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden divide-y divide-border">
          {bonusQuestions.map(q => {
            const answer = bonusAnswers.find(a => a.question_id === q.id)
            return (
              <div key={q.id} className="px-4 py-4 space-y-2">
                <div className="font-medium text-sm">{q.question_text}</div>
                <div className="text-xs text-muted">{q.points_value} points</div>
                {q.is_resolved ? (
                  <div className="text-sm">
                    <span className="text-muted">Correct answer: </span>
                    <span className="text-accent font-medium">{q.correct_answer}</span>
                    {answer && (
                      <span className={`ml-2 text-xs ${answer.points_earned > 0 ? 'text-gold' : 'text-danger'}`}>
                        (You: {answer.answer_text} -- {answer.points_earned > 0 ? `+${answer.points_earned}` : '0 pts'})
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bonusInputs[q.id] || ''}
                      onChange={e => setBonusInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Your answer..."
                      className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm"
                    />
                    <button
                      onClick={() => handleSaveBonus(q.id)}
                      className="px-3 py-2 bg-accent text-background rounded text-sm font-semibold hover:bg-accent-dim"
                    >
                      {answer ? 'Update' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
