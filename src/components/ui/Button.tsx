'use client'

import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import { useHaptic } from '@/hooks/useHaptic'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  isLoading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

// Loading spinner SVG component
function LoadingSpinner({ size }: { size: ButtonSize }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <svg
      className={`${sizeClasses[size]} animate-spin`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  icon,
  fullWidth = false,
  disabled,
  className,
  onClick,
  ...props
}: ButtonProps) {
  const { button: triggerButtonHaptic } = useHaptic()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      triggerButtonHaptic()
    }
    onClick?.(e)
  }

  // Size classes - height and padding
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-12 px-6 text-base',
  }

  // Variant classes - colors and states
  const variantClasses = {
    primary: 'bg-danger text-white hover:bg-red-600 focus-visible:outline-danger',
    secondary: 'bg-accent-primary text-white hover:bg-blue-600 focus-visible:outline-accent-primary',
    tertiary: 'bg-surface text-text-primary border border-border hover:bg-surface-hover focus-visible:outline-border',
    ghost: 'text-accent-primary hover:bg-blue-50 focus-visible:outline-accent-primary',
  }

  // Combine all classes
  const allClasses = [
    // Base classes
    'font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'min-h-touch-target min-w-touch-target',
    // Size classes
    sizeClasses[size],
    // Variant classes
    variantClasses[variant],
    // Full width
    fullWidth && 'w-full',
    // Custom classes
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      disabled={disabled || isLoading}
      className={allClasses}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={size} />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
