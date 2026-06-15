'use client'

import { useState } from 'react'
import { StageTabs } from '@/components/StageTabs'
import { MatchCard } from '@/components/MatchCard'
import { Card } from '@/components/ui/Card'
import type { Match, Prediction, Deadline, BonusQuestion, BonusAnswer } from '@/lib/types'

function isDeadlinePassed(deadlines: Deadline[], stage: string): boolean {
  const dl = deadlines.find(d => d.stage === stage)
  if (!dl) return false
  return new Date(dl.deadline_utc) < new Date()
}

interface PredictionsClientProps {
  userId: string
  matches: Match[]
  predictions: Prediction[]
  deadlines: Deadline[]
  bonusQuestions: BonusQuestion[]
  bonusAnswers: BonusAnswer[]
}

export function PredictionsClient({
  userId,
  matches,
  predictions: initialPredictions,
  deadlines,
  bonusQuestions,
  bonusAnswers: initialBonusAnswers,
}: PredictionsClientProps) {
  const [predictions, setPredictions] = useState(initialPredictions)
  const [bonusAnswers, setBonusAnswers] = useState(initialBonusAnswers)
  const [activeStage, setActiveStage] = useState<string>('group')
  const [bonusInputs, setBonusInputs] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {}
    initialBonusAnswers.forEach(a => { map[a.question_id] = a.answer_text })
    return map
  })

  const stageMatches = matches.filter(m => m.stage === activeStage)

  const handleSavePrediction = async (matchId: number, home: number, away: number) => {
    const existing = predictions.find(p => p.match_id === matchId)

    const res = await fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId,
        predictedHome: home,
        predictedAway: away,
        predictionId: existing?.id,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      if (existing) {
        setPredictions(prev => prev.map(p => p.id === existing.id ? data as Prediction : p))
      } else {
        setPredictions(prev => [...prev, data as Prediction])
      }
    }
  }

  const handleSaveBonus = async (questionId: number) => {
    const text = bonusInputs[questionId]?.trim()
    if (!text) return
    const existing = bonusAnswers.find(a => a.question_id === questionId)

    const res = await fetch('/api/bonus-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId,
        answerText: text,
        answerId: existing?.id,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      if (existing) {
        setBonusAnswers(prev => prev.map(a => a.id === existing.id ? data as BonusAnswer : a))
      } else {
        setBonusAnswers(prev => [...prev, data as BonusAnswer])
      }
    }
  }

  const isStageLockedByDeadline = isDeadlinePassed(deadlines, activeStage)

  return (
    <div className="space-y-6">
      <StageTabs activeStage={activeStage} onStageChange={setActiveStage} />

      <div className="max-w-7xl mx-auto px-4 space-y-3">
        {stageMatches.length === 0 ? (
          <Card variant="default" className="text-center py-6">
            <p className="text-text-secondary">No matches for this stage</p>
          </Card>
        ) : (
          stageMatches.map(match => {
            const matchPrediction = predictions.find(p => p.match_id === match.id)
            return (
              <MatchCard
                key={match.id}
                match={match}
                prediction={matchPrediction}
                isLocked={isStageLockedByDeadline || matchPrediction?.is_locked}
                onSubmit={async ({ home, away }) => {
                  await handleSavePrediction(match.id, home, away)
                }}
              />
            )
          })
        )}
      </div>

      {/* Bonus Questions Tab */}
      <div className="max-w-7xl mx-auto px-4">
        <Card variant="default" className="space-y-3">
          <h2 className="text-lg font-semibold text-text-primary">Bonus Questions</h2>
          <p className="text-sm text-text-secondary">+5 pts each</p>
          {/* Bonus questions will be added in a future task */}
        </Card>
      </div>
    </div>
  )
}
