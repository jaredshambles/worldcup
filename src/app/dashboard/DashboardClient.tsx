'use client'

import Link from 'next/link'
import type { PredictionWithMatch, LeaderboardEntry, BonusAnswer, BonusQuestion } from '@/lib/types'
import { STAGE_LABELS, STAGE_ORDER, getTeamFlag } from '@/lib/types'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
      {sub && <div className="text-xs text-accent mt-0.5">{sub}</div>}
    </div>
  )
}

export function DashboardClient({
  me,
  predictions,
  leaderboard,
  bonusAnswers,
  bonusQuestions,
}: {
  me: LeaderboardEntry | null
  predictions: PredictionWithMatch[]
  leaderboard: LeaderboardEntry[]
  bonusAnswers: BonusAnswer[]
  bonusQuestions: BonusQuestion[]
}) {
  const totalPlayers = leaderboard.length

  // Recent results (finished matches with predictions)
  const recentResults = predictions
    .filter(p => p.matches?.status === 'finished')
    .sort((a, b) => b.match_id - a.match_id)
    .slice(0, 10)

  // Upcoming (scheduled with predictions)
  const upcoming = predictions
    .filter(p => p.matches?.status === 'scheduled')
    .sort((a, b) => a.match_id - b.match_id)
    .slice(0, 5)

  // Predictions by stage
  const byStage = STAGE_ORDER.map(stage => {
    const stagePreds = predictions.filter(p => p.matches?.stage === stage)
    const finished = stagePreds.filter(p => p.matches?.status === 'finished')
    const pts = finished.reduce((sum, p) => sum + p.points_earned, 0)
    return { stage, label: STAGE_LABELS[stage], count: stagePreds.length, points: pts }
  }).filter(s => s.count > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <Link
          href="/predictions"
          className="text-sm px-4 py-2 bg-accent text-background rounded-lg font-semibold hover:bg-accent-dim transition-colors"
        >
          Make Predictions
        </Link>
      </div>

      {/* Stats row */}
      {me ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Rank"
            value={`#${me.rank}`}
            sub={`of ${totalPlayers}`}
          />
          <StatCard label="Total Points" value={me.total_points} />
          <StatCard label="Exact Scores" value={me.exact_scores} />
          <StatCard label="Correct Winners" value={me.correct_winners} />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-6 text-center text-muted">
          No predictions yet. <Link href="/predictions" className="text-accent hover:underline">Submit your first prediction</Link> to appear on the leaderboard.
        </div>
      )}

      {/* Stage breakdown */}
      {byStage.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Points by Stage</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {byStage.map(s => (
              <div key={s.stage} className="flex justify-between text-sm px-3 py-2 bg-background rounded">
                <span className="text-muted">{s.label}</span>
                <span className="font-bold">{s.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent results */}
      {recentResults.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold">Recent Results</h2>
          </div>
          <div className="divide-y divide-border">
            {recentResults.map(p => {
              const m = p.matches
              const isExact = p.points_earned === 3
              const isWinner = p.points_earned === 2
              return (
                <div key={p.id} className="px-4 py-3 flex items-center justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {getTeamFlag(m.home_team)} {m.home_team} {m.home_score} - {m.away_score} {m.away_team} {getTeamFlag(m.away_team)}
                    </div>
                    <div className="text-xs text-muted">
                      Your pick: {p.predicted_home} - {p.predicted_away}
                    </div>
                  </div>
                  <div className={`ml-3 px-2 py-0.5 rounded text-xs font-bold ${
                    isExact ? 'bg-gold/20 text-gold' :
                    isWinner ? 'bg-accent/20 text-accent' :
                    'bg-danger/20 text-danger'
                  }`}>
                    {isExact ? '+3' : isWinner ? '+2' : '0'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming predictions */}
      {upcoming.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold">Upcoming Picks</h2>
          </div>
          <div className="divide-y divide-border">
            {upcoming.map(p => {
              const m = p.matches
              return (
                <div key={p.id} className="px-4 py-3 flex items-center justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {getTeamFlag(m.home_team)} {m.home_team} vs {m.away_team} {getTeamFlag(m.away_team)}
                    </div>
                    <div className="text-xs text-muted">
                      {m.match_date} at {m.match_time}
                    </div>
                  </div>
                  <div className="ml-3 text-accent text-xs font-semibold">
                    {p.predicted_home} - {p.predicted_away}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Bonus questions */}
      {bonusQuestions.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold">Bonus Questions</h2>
          </div>
          <div className="divide-y divide-border">
            {bonusQuestions.map(q => {
              const answer = bonusAnswers.find(a => a.question_id === q.id)
              return (
                <div key={q.id} className="px-4 py-3 text-sm">
                  <div className="font-medium">{q.question_text}</div>
                  <div className="text-xs mt-1">
                    {answer ? (
                      <span className="text-accent">Your answer: {answer.answer_text}
                        {q.is_resolved && (
                          <span className={answer.points_earned > 0 ? ' text-gold' : ' text-danger'}>
                            {' '}({answer.points_earned > 0 ? `+${answer.points_earned}` : '0 pts'})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted">Not answered yet ({q.points_value} pts)</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
