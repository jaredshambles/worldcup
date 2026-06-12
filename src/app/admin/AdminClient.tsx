'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { STAGE_LABELS } from '@/lib/types'
import type { Match, Profile, BonusQuestion } from '@/lib/types'

type Tab = 'matches' | 'players' | 'bonus' | 'news'

function MatchRow({ match, onUpdate }: { match: Match; onUpdate: (m: Match) => void }) {
  const [homeScore, setHomeScore] = useState(match.home_score?.toString() ?? '')
  const [awayScore, setAwayScore] = useState(match.away_score?.toString() ?? '')
  const [status, setStatus] = useState(match.status)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    setSaving(true)
    const updates: Record<string, unknown> = { status }
    if (homeScore !== '') updates.home_score = parseInt(homeScore)
    if (awayScore !== '') updates.away_score = parseInt(awayScore)

    const { data } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', match.id)
      .select()
      .single()

    if (data) onUpdate(data as Match)
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-2 py-2 px-3 text-sm border-b border-border/50">
      <span className="w-8 text-xs text-muted">M{match.match_number}</span>
      <span className="flex-1 truncate text-xs">{match.home_team} vs {match.away_team}</span>
      <input
        type="number" min={0} value={homeScore}
        onChange={e => setHomeScore(e.target.value)}
        className="w-10 h-7 text-center bg-background border border-border rounded text-xs"
      />
      <span className="text-muted text-xs">-</span>
      <input
        type="number" min={0} value={awayScore}
        onChange={e => setAwayScore(e.target.value)}
        className="w-10 h-7 text-center bg-background border border-border rounded text-xs"
      />
      <select
        value={status}
        onChange={e => setStatus(e.target.value as Match['status'])}
        className="bg-background border border-border rounded text-xs px-1 py-1"
      >
        <option value="scheduled">Scheduled</option>
        <option value="live">Live</option>
        <option value="finished">Finished</option>
      </select>
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-2 py-1 bg-accent text-background rounded text-xs font-semibold hover:bg-accent-dim disabled:opacity-40"
      >
        {saving ? '...' : 'Save'}
      </button>
    </div>
  )
}

export function AdminClient({
  matches: initialMatches,
  profiles,
  bonusQuestions: initialBonus,
}: {
  matches: Match[]
  profiles: Profile[]
  bonusQuestions: BonusQuestion[]
}) {
  const [tab, setTab] = useState<Tab>('matches')
  const [matches, setMatches] = useState(initialMatches)
  const [bonusQuestions, setBonusQuestions] = useState(initialBonus)
  const [stageFilter, setStageFilter] = useState('all')
  const [newsTitle, setNewsTitle] = useState('')
  const [newsBody, setNewsBody] = useState('')
  const supabase = createClient()

  const filteredMatches = stageFilter === 'all'
    ? matches
    : matches.filter(m => m.stage === stageFilter)

  const handleUpdateMatch = (updated: Match) => {
    setMatches(prev => prev.map(m => m.id === updated.id ? updated : m))
  }

  const handleResolveBonus = async (qId: number, correctAnswer: string) => {
    const { data } = await supabase
      .from('bonus_questions')
      .update({ correct_answer: correctAnswer, is_resolved: true })
      .eq('id', qId)
      .select()
      .single()
    if (data) {
      setBonusQuestions(prev => prev.map(q => q.id === qId ? data as BonusQuestion : q))
    }
  }

  const handlePostNews = async () => {
    if (!newsTitle.trim()) return
    await supabase.from('news_feed').insert({
      title: newsTitle.trim(),
      body: newsBody.trim() || null,
      is_auto: false,
    })
    setNewsTitle('')
    setNewsBody('')
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'matches', label: 'Matches' },
    { key: 'players', label: 'Players' },
    { key: 'bonus', label: 'Bonus' },
    { key: 'news', label: 'Post News' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="flex gap-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded text-sm ${
              tab === t.key ? 'bg-accent text-background font-semibold' : 'bg-card text-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'matches' && (
        <div className="space-y-3">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setStageFilter('all')}
              className={`px-2 py-1 rounded text-xs ${stageFilter === 'all' ? 'bg-accent text-background' : 'bg-card text-muted'}`}
            >All</button>
            {Object.entries(STAGE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStageFilter(key)}
                className={`px-2 py-1 rounded text-xs whitespace-nowrap ${stageFilter === key ? 'bg-accent text-background' : 'bg-card text-muted'}`}
              >{label}</button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {filteredMatches.map(m => (
              <MatchRow key={m.id} match={m} onUpdate={handleUpdateMatch} />
            ))}
          </div>
        </div>
      )}

      {tab === 'players' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_80px_80px] gap-2 px-4 py-2 bg-card-hover text-xs text-muted font-semibold">
            <span>Name</span><span>Email</span><span>Paid</span><span>Admin</span>
          </div>
          {profiles.map(p => (
            <div key={p.id} className="grid grid-cols-[1fr_1fr_80px_80px] gap-2 px-4 py-2 text-sm border-t border-border/50">
              <span className="truncate">{p.full_name} {p.nickname ? `(${p.nickname})` : ''}</span>
              <span className="truncate text-muted text-xs">{p.email}</span>
              <span className={p.is_paid ? 'text-accent' : 'text-muted'}>{p.is_paid ? 'Yes' : 'No'}</span>
              <span className={p.is_admin ? 'text-gold' : 'text-muted'}>{p.is_admin ? 'Yes' : 'No'}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'bonus' && (
        <div className="space-y-3">
          {bonusQuestions.map(q => (
            <BonusEditor key={q.id} question={q} onResolve={handleResolveBonus} />
          ))}
        </div>
      )}

      {tab === 'news' && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <input
            type="text"
            value={newsTitle}
            onChange={e => setNewsTitle(e.target.value)}
            placeholder="News title..."
            className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
          />
          <textarea
            value={newsBody}
            onChange={e => setNewsBody(e.target.value)}
            placeholder="Details (optional)..."
            rows={3}
            className="w-full px-3 py-2 bg-background border border-border rounded text-sm resize-none"
          />
          <button
            onClick={handlePostNews}
            disabled={!newsTitle.trim()}
            className="px-4 py-2 bg-accent text-background rounded font-semibold text-sm hover:bg-accent-dim disabled:opacity-40"
          >
            Post News
          </button>
        </div>
      )}
    </div>
  )
}

function BonusEditor({ question, onResolve }: { question: BonusQuestion; onResolve: (id: number, answer: string) => void }) {
  const [answer, setAnswer] = useState(question.correct_answer || '')

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-2">
      <div className="font-medium text-sm">{question.question_text}</div>
      <div className="text-xs text-muted">{question.points_value} pts | {question.is_resolved ? 'Resolved' : 'Open'}</div>
      {!question.is_resolved && (
        <div className="flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Correct answer..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm"
          />
          <button
            onClick={() => onResolve(question.id, answer)}
            disabled={!answer.trim()}
            className="px-3 py-2 bg-gold text-background rounded text-sm font-semibold hover:opacity-90 disabled:opacity-40"
          >
            Resolve
          </button>
        </div>
      )}
      {question.is_resolved && (
        <div className="text-sm text-accent">Answer: {question.correct_answer}</div>
      )}
    </div>
  )
}
