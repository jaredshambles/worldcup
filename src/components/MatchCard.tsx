'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { ScoreInput } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Match, Prediction } from '@/lib/types'

interface MatchCardProps {
  match: Match
  prediction?: Prediction
  isLocked?: boolean
  onSubmit?: (prediction: { home: number; away: number }) => Promise<void>
}

export function MatchCard({
  match,
  prediction,
  isLocked,
  onSubmit,
}: MatchCardProps) {
  const [home, setHome] = useState(prediction?.predicted_home || 0)
  const [away, setAway] = useState(prediction?.predicted_away || 0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onSubmit?.({ home, away })
    } finally {
      setLoading(false)
    }
  }

  const matchDate = new Date(match.match_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const matchTime = match.match_time?.substring(0, 5) || 'TBA'

  return (
    <Card
      variant="default"
      className="space-y-3"
      role="region"
      aria-label={`Match: ${match.home_team} vs ${match.away_team}`}
    >
      {/* Match Header */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-text-primary">
          {match.home_team} vs {match.away_team}
        </h3>
        <p className="text-xs text-text-secondary">
          {match.stage === 'group' ? `Group ${match.group_letter}` : match.stage.toUpperCase()} • {matchDate} {matchTime}
        </p>
      </div>

      {/* Score Inputs */}
      <div className="flex gap-2 items-center" role="group" aria-label="Match score prediction">
        <div className="flex-1">
          <label htmlFor={`home-score-${match.id}`} className="sr-only">
            {match.home_team} score
          </label>
          <ScoreInput
            value={home}
            onChange={setHome}
            disabled={isLocked}
          />
        </div>
        <span className="text-sm font-medium text-text-secondary" aria-hidden="true">vs</span>
        <div className="flex-1">
          <label htmlFor={`away-score-${match.id}`} className="sr-only">
            {match.away_team} score
          </label>
          <ScoreInput
            value={away}
            onChange={setAway}
            disabled={isLocked}
          />
        </div>
      </div>

      {/* Deadline or Lock Status */}
      {isLocked ? (
        <p className="text-xs text-text-secondary text-center">
          🔒 Locked
        </p>
      ) : (
        <p className="text-xs text-text-secondary text-center">
          ⏱ 2h 15m remaining
        </p>
      )}

      {/* Submit Button */}
      {!isLocked && (
        <Button
          variant="secondary"
          size="md"
          fullWidth
          isLoading={loading}
          onClick={handleSubmit}
        >
          Save Prediction
        </Button>
      )}

      {/* Show actual result if match is finished */}
      {match.status === 'finished' && (
        <div className="pt-2 border-t border-border text-center">
          <p className="text-xs text-text-secondary">Final Score</p>
          <p className="text-sm font-semibold text-text-primary">
            {match.home_score}-{match.away_score}
          </p>
          {prediction && (
            <p className={`text-xs ${
              prediction.points_earned > 0
                ? 'text-success'
                : 'text-danger'
            }`}>
              +{prediction.points_earned} pts
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
