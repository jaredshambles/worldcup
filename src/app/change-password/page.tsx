'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { changePassword, signOut } from '@/lib/auth-client'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password')
      return
    }

    setLoading(true)
    try {
      const { error: authError } = await changePassword({
        currentPassword,
        newPassword,
      })

      if (authError) {
        setError(authError.message || 'Failed to change password')
        setLoading(false)
        return
      }

      const res = await fetch('/api/user/clear-password-flag', {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok) {
        setError('Password changed but failed to update flag. Please contact admin.')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-card rounded-lg border border-border p-6 sm:p-8 text-center">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-xl sm:text-2xl font-bold">Change Your Password</h1>
          <p className="text-muted text-sm mt-2">
            You must set a new password before continuing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-lg border border-border p-6 sm:p-8 space-y-4"
        >
          <div>
            <label className="block text-sm text-muted mb-1">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
            />
            <p className="text-xs text-muted mt-1">Your temporary password is: Test1234!</p>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password (min 8 characters)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-primary text-white font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Changing password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
