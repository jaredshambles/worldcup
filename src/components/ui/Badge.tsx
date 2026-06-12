import React, { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
  icon?: ReactNode
}

export function Badge({
  children,
  variant = 'default',
  icon,
  className,
  ...props
}: BadgeProps) {
  // Variant classes - background, border, and text colors
  const variantClasses = {
    default: 'bg-surface border-border text-text-primary',
    success: 'bg-highlight-bg border-highlight-border text-success',
    warning: 'bg-yellow-50 border-yellow-200 text-warning',
    danger: 'bg-error-bg border-danger text-danger',
    info: 'bg-achievement-bg border-achievement-border text-achievement-text',
  }

  // Combine all classes
  const allClasses = [
    // Base classes
    'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-sm border',
    // Variant classes
    variantClasses[variant],
    // Custom classes
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={allClasses} {...props}>
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </span>
  )
}
