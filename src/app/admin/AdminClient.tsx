'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input, ScoreInput } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Match, Profile } from '@/lib/types'

interface AdminClientProps {
  matches: Match[]
  players: Profile[]
}

export function AdminClient({ matches, players }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<'matches' | 'players' | 'bonus'>('matches')
  const [editingMatch, setEditingMatch] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-3 border-b-2 font-medium transition-colors ${
            activeTab === 'matches'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-text-secondary'
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => setActiveTab('players')}
          className={`px-4 py-3 border-b-2 font-medium transition-colors ${
            activeTab === 'players'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-text-secondary'
          }`}
        >
          Players
        </button>
        <button
          onClick={() => setActiveTab('bonus')}
          className={`px-4 py-3 border-b-2 font-medium transition-colors ${
            activeTab === 'bonus'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-text-secondary'
          }`}
        >
          Bonus
        </button>
      </div>

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div className="space-y-3">
          {matches.map(match => (
            <Card key={match.id} variant="default" className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">
                {match.home_team} vs {match.away_team}
              </h3>

              {editingMatch === match.id.toString() ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs uppercase font-medium text-text-secondary">Home Score</label>
                      <ScoreInput
                        value={match.home_score || 0}
                        onChange={() => {}}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs uppercase font-medium text-text-secondary">Away Score</label>
                      <ScoreInput
                        value={match.away_score || 0}
                        onChange={() => {}}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase font-medium text-text-secondary">Status</label>
                    <select className="w-full px-3 py-2 border border-border rounded-sm bg-white text-text-primary">
                      <option>Scheduled</option>
                      <option>Live</option>
                      <option>Finished</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setEditingMatch(null)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => setEditingMatch(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-text-secondary">
                    {match.home_score}-{match.away_score} • {match.status}
                  </p>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => setEditingMatch(match.id.toString())}
                  >
                    Edit
                  </Button>
                </>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Players Tab */}
      {activeTab === 'players' && (
        <div className="space-y-3">
          {players.map(player => (
            <Card key={player.id} variant="default" className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-text-primary">{player.full_name}</p>
                <p className="text-xs text-text-secondary">{player.email}</p>
              </div>
              <Button
                variant="tertiary"
                size="sm"
                className="text-danger"
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Bonus Tab */}
      {activeTab === 'bonus' && (
        <Card variant="default" className="text-center py-6">
          <p className="text-text-secondary">Bonus question resolution coming soon</p>
        </Card>
      )}
    </div>
  )
}
