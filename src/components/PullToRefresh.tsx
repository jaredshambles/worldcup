'use client'

import { useState, useRef, useEffect } from 'react'
import { useHaptic } from '@/hooks/useHaptic'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const touchStartRef = useRef(0)
  const { success } = useHaptic()

  const PULL_THRESHOLD = 80

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY
    const distance = currentY - touchStartRef.current

    // Only trigger pull-to-refresh if at top of page
    if (distance > 0 && typeof window !== 'undefined' && window.scrollY === 0) {
      setIsPulling(true)
      setPullDistance(Math.min(distance, PULL_THRESHOLD))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance >= PULL_THRESHOLD) {
      setIsLoading(true)
      try {
        await onRefresh()
        success()
      } finally {
        setIsLoading(false)
      }
    }
    setIsPulling(false)
    setPullDistance(0)
  }

  const pullPercentage = (pullDistance / PULL_THRESHOLD) * 100

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden transition-colors"
        style={{
          height: `${pullDistance}px`,
          backgroundColor: pullPercentage > 100 ? '#34d399' : '#dbeafe',
        }}
      >
        {!isLoading && (
          <span
            style={{
              transform: `rotate(${pullPercentage * 3.6}deg)`,
              opacity: pullPercentage / 100,
            }}
          >
            ↻
          </span>
        )}
        {isLoading && (
          <span className="animate-spin">⟳</span>
        )}
      </div>

      {/* Content */}
      <div style={{ paddingTop: isPulling ? pullDistance : 0 }}>
        {children}
      </div>
    </div>
  )
}
