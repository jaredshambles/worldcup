'use client'

import React, { InputHTMLAttributes, forwardRef } from 'react'

/**
 * Input Component Props
 * Generic text/number input component with optional label, error, and helper text
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * Input Component
 * A generic, reusable input component with light theme ESPN-inspired styling.
 * Supports labels, error messages, and helper text.
 *
 * Usage:
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={errors.email}
 *   helperText="We'll never share your email"
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, type = 'text', ...props }, ref) => {
    const baseClasses = [
      // Padding: 8px 12px (px-3 py-2)
      'px-3 py-2',
      // Text size: 14px (text-sm)
      'text-sm',
      // Border: 1px solid #e5e7eb
      'border border-border',
      // Border radius: 4px (rounded-xs)
      'rounded-xs',
      // Background: white
      'bg-white',
      // Text color: #1f2937
      'text-text-primary',
      // Placeholder color: #9ca3af
      'placeholder-text-tertiary',
      // Focus state: 2px solid #3b82f6 with shadow
      'focus-visible:outline-none',
      'focus-visible:border-2',
      'focus-visible:border-accent-secondary',
      'focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]',
      // Disabled state
      'disabled:bg-surface',
      'disabled:cursor-not-allowed',
      // Transitions
      'transition-colors duration-200',
      // Error state
      error && 'border-danger',
    ]
      .filter(Boolean)
      .join(' ')

    const finalClassName = className ? `${baseClasses} ${className}` : baseClasses

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs uppercase tracking-wider text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={finalClassName}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {helperText && !error && <p className="text-xs text-text-secondary">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

/**
 * ScoreInput Component Props
 * Specialized number input for match score predictions (home vs away)
 */
interface ScoreInputProps {
  value: number | string
  onChange: (value: number) => void
  onFocus?: () => void
  disabled?: boolean
}

/**
 * ScoreInput Component
 * A specialized number input for match score predictions.
 * Displays centered, monospace numbers at 48px height for mobile touch accuracy.
 * Validates input to ensure non-negative values (0-99).
 *
 * Usage:
 * <ScoreInput
 *   value={homeScore}
 *   onChange={(score) => setHomeScore(score)}
 *   disabled={isLocked}
 * />
 */
export function ScoreInput({
  value,
  onChange,
  onFocus,
  disabled = false,
}: ScoreInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let numValue = parseInt(e.target.value, 10)

    // Validate: ensure non-negative
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0
    }

    // Cap at 99
    if (numValue > 99) {
      numValue = 99
    }

    onChange(numValue)
  }

  return (
    <input
      type="number"
      inputMode="numeric"
      min="0"
      max="99"
      value={value}
      onChange={handleChange}
      onFocus={onFocus}
      disabled={disabled}
      className={[
        // Width and height: full width, 48px height (h-12)
        'w-full h-12',
        // Text size: 18px (text-lg), monospace font
        'text-lg font-mono font-medium',
        // Text alignment: center
        'text-center',
        // Border: 2px solid #e5e7eb
        'border-2 border-border',
        // Border radius: 4px (rounded-xs)
        'rounded-xs',
        // Background: white
        'bg-white',
        // Text color: #1f2937
        'text-text-primary',
        // Focus state: 2px solid blue border
        'focus-visible:outline-none',
        'focus-visible:border-accent-secondary',
        'focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]',
        // Disabled state
        disabled && 'bg-surface',
        disabled && 'cursor-not-allowed',
        // Transitions
        'transition-colors duration-200',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
