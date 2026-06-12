'use client'

import { useEffect, useState } from 'react'
import type { Deadline } from '@/lib/types'

function getNextDeadline(deadlines: Deadline[]): Deadline | null {
  const now = new Date()
  return deadlines
    .filter(d => new Date(d.deadline_utc) > now)
    .sort((a, b) => new Date(a.deadline_utc).getTime() - new Date(b.deadline_utc).getTime())[0] || null
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'CLOSED'
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}

export function DeadlineBanner({ deadlines }: { deadlines: Deadline[] }) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const next = getNextDeadline(deadlines)
  if (!next) return null

  const remaining = new Date(next.deadline_utc).getTime() - now
  const isUrgent = remaining < 86400000 // less than 24h

  return (
    <div className={`rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
      isUrgent ? 'bg-danger/20 border border-danger/40' : 'bg-accent/10 border border-accent/20'
    }`}>
      <div className="text-sm">
        <span className="font-semibold">Next Deadline:</span>{' '}
        <span className="text-muted">{next.description}</span>
      </div>
      <div className={`text-lg font-mono font-bold ${isUrgent ? 'text-danger' : 'text-accent'}`}>
        {formatCountdown(remaining)}
      </div>
    </div>
  )
}
