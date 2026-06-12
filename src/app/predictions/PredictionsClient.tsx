'use client'

import { useState } from 'react'
import { StageTabs } from '@/components/StageTabs'
import { MatchCard } from '@/components/MatchCard'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
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

  const supabase = createClient()

  const stageMatches = matches.filter(m => m.stage === activeStage)

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
