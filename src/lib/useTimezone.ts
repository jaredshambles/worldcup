import { useState, useEffect } from 'react'

// Common timezones for World Cup 2026 (USA-focused but including global coverage)
export const TIMEZONES = [
  { id: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-8/-7' },
  { id: 'America/Denver', label: 'Mountain Time (MT)', offset: 'UTC-7/-6' },
  { id: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-6/-5' },
  { id: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5/-4' },
  { id: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 'UTC' },
  { id: 'Europe/London', label: 'London (GMT/BST)', offset: 'UTC+0/+1' },
  { id: 'Europe/Paris', label: 'Central Europe (CET/CEST)', offset: 'UTC+1/+2' },
  { id: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: 'UTC+4' },
  { id: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 'UTC+9' },
  { id: 'Australia/Sydney', label: 'Australian Eastern (AEDT/AEST)', offset: 'UTC+10/+11' },
]

const STORAGE_KEY = 'wc-timezone'

export function useTimezone() {
  const [timezone, setTimezone] = useState<string>('America/Chicago')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && TIMEZONES.some(tz => tz.id === stored)) {
      setTimezone(stored)
      setIsLoading(false)
      return
    }

    // Auto-detect based on IP geolocation
    detectTimezone()
  }, [])

  const detectTimezone = async () => {
    try {
      // Try to use browser's Intl API first (works in most modern browsers)
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (TIMEZONES.some(tz => tz.id === browserTimezone)) {
        setTimezone(browserTimezone)
        localStorage.setItem(STORAGE_KEY, browserTimezone)
        setIsLoading(false)
        return
      }

      // Fall back to IP-based geolocation via ip-api.com
      const response = await fetch('https://ip-api.com/json/', {
        headers: { 'Accept': 'application/json' }
      }).then(r => r.json())

      if (response?.timezone) {
        const tz = response.timezone
        if (TIMEZONES.some(t => t.id === tz)) {
          setTimezone(tz)
          localStorage.setItem(STORAGE_KEY, tz)
        }
      }
    } catch (error) {
      console.log('Timezone detection failed, using default')
    } finally {
      setIsLoading(false)
    }
  }

  const setUserTimezone = (tz: string) => {
    if (TIMEZONES.some(t => t.id === tz)) {
      setTimezone(tz)
      localStorage.setItem(STORAGE_KEY, tz)
    }
  }

  return { timezone, setUserTimezone, isLoading, TIMEZONES }
}

export function formatTimeInTimezone(time: string, timezone: string): string {
  try {
    const [hours, minutes] = time.split(':').map(Number)
    const now = new Date()
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0)

    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
      hour12: false,
    })

    return formatter.format(date)
  } catch {
    return time
  }
}
