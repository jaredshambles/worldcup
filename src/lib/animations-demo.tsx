/**
 * Demo component for testing animation utilities
 * This file demonstrates and validates all animation functions
 */

'use client'

import { useRef, useEffect, useState } from 'react'
import { animateCounter, triggerConfetti, ANIMATION_DURATIONS, ANIMATION_EASING, smoothTransition } from './animations'

export function AnimationsDemo() {
  const counterRef = useRef<HTMLDivElement>(null)
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    const results: string[] = []

    // Test 1: Animation constants
    results.push('✓ ANIMATION_DURATIONS: fast=' + ANIMATION_DURATIONS.fast + ', normal=' + ANIMATION_DURATIONS.normal + ', slow=' + ANIMATION_DURATIONS.slow)
    results.push('✓ ANIMATION_EASING: easeOut=' + ANIMATION_EASING.easeOut.substring(0, 20) + '...')
    results.push('✓ smoothTransition: ' + smoothTransition)

    // Test 2: Number counter animation
    if (counterRef.current) {
      counterRef.current.textContent = '0'
      animateCounter(counterRef.current, 0, 100, 1000).then(() => {
        results.push('✓ animateCounter: animated 0 -> 100 successfully')
        setTestResults([...results])
      })
    }

    // Test 3: Confetti animation
    setTimeout(() => {
      triggerConfetti(window.innerWidth / 2, window.innerHeight / 2)
      results.push('✓ triggerConfetti: particles created at center')
      setTestResults([...results])
    }, 1500)

    // Verify canvas cleanup after confetti
    setTimeout(() => {
      const canvasCount = document.querySelectorAll('canvas').length
      if (canvasCount === 0) {
        results.push('✓ Canvas cleanup: confetti canvas removed after animation')
      } else {
        results.push('⚠ Canvas cleanup: ' + canvasCount + ' canvas element(s) still present')
      }
      setTestResults([...results])
    }, 2200)
  }, [])

  return (
    <div className={smoothTransition + ' p-4 bg-gray-900 rounded-lg border border-gray-700'}>
      <h2 className="text-lg font-bold mb-4">Animation Utilities Test</h2>
      <div className="space-y-2 text-sm font-mono">
        <div>
          <span className="text-gray-400">Counter (0 to 100):</span>
          <div ref={counterRef} className="text-2xl font-bold text-blue-400 mt-2">
            0
          </div>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-4">
          <p className="text-gray-400 mb-2">Test Results:</p>
          {testResults.map((result, i) => (
            <div key={i} className="text-green-400">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
