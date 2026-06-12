/**
 * Animation utilities for smooth, performant interactions
 */

export const ANIMATION_DURATIONS = {
  fast: '0.15s',
  normal: '0.3s',
  slow: '0.5s',
} as const

export const ANIMATION_EASING = {
  easeOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
} as const

/**
 * Number counter animation (for rank, points, etc.)
 * Smoothly animates from startValue to endValue
 */
export function animateCounter(
  element: HTMLElement,
  startValue: number,
  endValue: number,
  duration: number = 1000
): Promise<void> {
  return new Promise(resolve => {
    const startTime = performance.now()
    const difference = endValue - startValue

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-in-out)
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress

      const currentValue = Math.round(startValue + difference * easeProgress)
      element.textContent = currentValue.toString()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(animate)
  })
}

/**
 * Confetti animation for achievements
 * Creates subtle, performant confetti effect
 */
export function triggerConfetti(x: number, y: number): void {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'

  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const particles: Array<{
    x: number
    y: number
    vx: number
    vy: number
    life: number
    color: string
  }> = []

  // Create 10 particles
  const colors = ['#ef4444', '#3b82f6', '#fbbf24', '#34d399']
  for (let i = 0; i < 10; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * -8,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }

  const startTime = performance.now()
  const duration = 500 // 0.5s

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = elapsed / duration

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const particle of particles) {
      particle.y += particle.vy
      particle.vy += 0.2 // gravity
      particle.life -= 0.02

      ctx.globalAlpha = particle.life
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      document.body.removeChild(canvas)
    }
  }

  requestAnimationFrame(animate)
}

/**
 * CSS class for smooth transitions
 * Apply to elements that will change between states
 */
export const smoothTransition = 'transition-all duration-300 ease-in-out'
