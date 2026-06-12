import React, { HTMLAttributes, ReactNode } from 'react'

type CardVariant = 'default' | 'highlight' | 'urgency' | 'achievement' | 'error'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: CardVariant
  interactive?: boolean
}

export function Card({
  children,
  variant = 'default',
  interactive = false,
  className,
  ...props
}: CardProps) {
  // Variant classes - background and border colors
  const variantClasses = {
    default: 'bg-white border-border',
    highlight: 'bg-highlight-bg border-highlight-border',
    urgency: 'bg-urgency-bg border-urgency-border',
    achievement: 'bg-achievement-bg border-achievement-border',
    error: 'bg-error-bg border-danger',
  }

  // Interactive classes - only applied to default variant
  const interactiveClasses = interactive && variant === 'default' ? 'cursor-pointer hover:bg-surface-hover shadow-hover' : ''

  // Combine all classes
  const allClasses = [
    // Base classes
    'rounded-md p-3 border transition-colors duration-200',
    // Variant classes
    variantClasses[variant],
    // Interactive classes
    interactiveClasses,
    // Custom classes
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={allClasses} {...props}>
      {children}
    </div>
  )
}
