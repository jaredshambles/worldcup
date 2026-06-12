/**
 * Haptic feedback for iOS and Android
 * Uses navigator.vibrate() API
 */

export type HapticType =
  | 'light'      // 30ms light pulse
  | 'medium'     // 50ms medium pulse
  | 'heavy'      // 70ms heavy pulse
  | 'selection'  // 15ms light selection
  | 'success'    // Double pulse (30ms + 30ms gap + 30ms)

const hapticPatterns: Record<HapticType, number | number[]> = {
  light: 30,
  medium: 50,
  heavy: 70,
  selection: 15,
  success: [30, 30, 30],
}

export function triggerHaptic(type: HapticType): void {
  // Check if vibration API is available
  if (!navigator.vibrate) {
    console.debug('Haptic feedback not supported on this device')
    return
  }

  try {
    navigator.vibrate(hapticPatterns[type])
  } catch (error) {
    console.debug('Haptic feedback error:', error)
  }
}

export function triggerButtonTap(): void {
  triggerHaptic('light')
}

export function triggerSuccess(): void {
  triggerHaptic('success')
}

export function triggerSelection(): void {
  triggerHaptic('selection')
}

export function triggerImpact(intensity: 'light' | 'medium' | 'heavy' = 'light'): void {
  triggerHaptic(intensity)
}
