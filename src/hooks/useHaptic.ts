'use client'

import { useCallback } from 'react'
import {
  triggerHaptic,
  triggerButtonTap,
  triggerSuccess,
  type HapticType,
} from '@/lib/haptics'

export function useHaptic() {
  const trigger = useCallback((type: HapticType) => {
    triggerHaptic(type)
  }, [])

  const button = useCallback(() => {
    triggerButtonTap()
  }, [])

  const success = useCallback(() => {
    triggerSuccess()
  }, [])

  return { trigger, button, success }
}
