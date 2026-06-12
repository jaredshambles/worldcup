'use client'

import { useTimezone, TIMEZONES } from '@/lib/useTimezone'
import { useState } from 'react'

export function TimezoneSelector() {
  const { timezone, setUserTimezone, isLoading } = useTimezone()
  const [isOpen, setIsOpen] = useState(false)

  const currentTz = TIMEZONES.find(tz => tz.id === timezone)

  if (isLoading) {
    return (
      <div className="text-xs text-muted">
        Loading timezone...
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-surface-hover transition-colors flex items-center gap-2"
      >
        <span>🌐</span>
        <span className="text-muted">{currentTz?.label.split(' ')[0]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
          <div className="sticky top-0 bg-surface-hover border-b border-border px-3 py-2">
            <p className="text-xs font-semibold text-text-secondary">Select Timezone</p>
          </div>
          <div className="divide-y divide-border">
            {TIMEZONES.map(tz => (
              <button
                key={tz.id}
                onClick={() => {
                  setUserTimezone(tz.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2.5 text-xs hover:bg-surface-hover transition-colors ${
                  timezone === tz.id ? 'bg-accent/10 border-l-2 border-accent' : ''
                }`}
              >
                <div className="font-medium text-text-primary">{tz.label}</div>
                <div className="text-muted text-xs mt-0.5">{tz.offset}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
