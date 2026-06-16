'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPassword } from '@/lib/auth-client'

export function ResetPasswordClient() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (!token) {
      setError('Invalid or missing reset token')
      setLoading(false)
      return
    }

    try {
      const { error: authError } = await resetPassword({
        newPassword: password,
        token,
      })

      if (authError) {
        setError(authError.message || 'Failed to reset password.')
      } else {
        setSuccess('Password reset! Redirecting to sign in...')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    }
    setLoading(false)
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-card rounded-lg border border-border p-6 sm:p-8 text-center">
          <p className="text-danger">Invalid or expired reset link.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 text-accent hover:underline font-semibold text-sm"
          >
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-card rounded-lg border border-border p-6 sm:p-8 text-center">
          <div className="text-4xl mb-2">⚽</div>
          <h1 className="text-xl sm:text-2xl font-bold">WC Bracket Challenge</h1>
          <p className="text-muted text-sm mt-2">Set a new password</p>
        </div>

        <form
          onSubmit={handleReset}
          className="bg-card rounded-lg border border-border p-6 sm:p-8 space-y-4"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
          />

          {success && <p className="text-green-500 text-sm">{success}</p>}
          {error && <p className="text-danger text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-primary text-white font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
