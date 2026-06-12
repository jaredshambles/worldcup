import {
  triggerHaptic,
  triggerButtonTap,
  triggerSuccess,
  triggerSelection,
  triggerImpact,
} from './haptics'

describe('Haptic Feedback', () => {
  let vibrateSpy: jest.SpyInstance

  beforeEach(() => {
    vibrateSpy = jest.spyOn(navigator, 'vibrate').mockImplementation(() => true)
  })

  afterEach(() => {
    vibrateSpy.mockRestore()
  })

  describe('triggerHaptic', () => {
    it('should trigger light haptic (30ms)', () => {
      triggerHaptic('light')
      expect(vibrateSpy).toHaveBeenCalledWith(30)
    })

    it('should trigger medium haptic (50ms)', () => {
      triggerHaptic('medium')
      expect(vibrateSpy).toHaveBeenCalledWith(50)
    })

    it('should trigger heavy haptic (70ms)', () => {
      triggerHaptic('heavy')
      expect(vibrateSpy).toHaveBeenCalledWith(70)
    })

    it('should trigger selection haptic (15ms)', () => {
      triggerHaptic('selection')
      expect(vibrateSpy).toHaveBeenCalledWith(15)
    })

    it('should trigger success haptic (double pulse)', () => {
      triggerHaptic('success')
      expect(vibrateSpy).toHaveBeenCalledWith([30, 30, 30])
    })
  })

  describe('convenience functions', () => {
    it('triggerButtonTap should trigger light haptic', () => {
      triggerButtonTap()
      expect(vibrateSpy).toHaveBeenCalledWith(30)
    })

    it('triggerSuccess should trigger success haptic', () => {
      triggerSuccess()
      expect(vibrateSpy).toHaveBeenCalledWith([30, 30, 30])
    })

    it('triggerSelection should trigger selection haptic', () => {
      triggerSelection()
      expect(vibrateSpy).toHaveBeenCalledWith(15)
    })

    it('triggerImpact should trigger with default light intensity', () => {
      triggerImpact()
      expect(vibrateSpy).toHaveBeenCalledWith(30)
    })

    it('triggerImpact should trigger with specified intensity', () => {
      triggerImpact('heavy')
      expect(vibrateSpy).toHaveBeenCalledWith(70)
    })
  })

  describe('graceful degradation', () => {
    it('should handle missing vibrate API', () => {
      const originalVibrate = navigator.vibrate
      Object.defineProperty(navigator, 'vibrate', {
        value: undefined,
        writable: true,
      })

      const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()

      triggerHaptic('light')

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        'Haptic feedback not supported on this device'
      )

      consoleDebugSpy.mockRestore()
      Object.defineProperty(navigator, 'vibrate', {
        value: originalVibrate,
        writable: true,
      })
    })

    it('should handle vibrate API errors', () => {
      vibrateSpy.mockImplementation(() => {
        throw new Error('Vibration not available')
      })

      const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()

      triggerHaptic('light')

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        'Haptic feedback error:',
        expect.any(Error)
      )

      consoleDebugSpy.mockRestore()
    })
  })
})
