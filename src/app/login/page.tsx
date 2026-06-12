'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-4">
        <div className="text-5xl">&#9993;</div>
        <h1 className="text-xl font-bold">Check your email</h1>
        <p className="text-muted">
          We sent a magic link to <span className="text-foreground font-medium">{email}</span>.
          Click the link in the email to sign in.
        </p>
        <button
          onClick={() => { setSent(false); setEmail('') }}
          className="text-sm text-accent hover:underline"
        >
          Use a different email
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-2">&#9917;</div>
          <h1 className="text-xl sm:text-2xl font-bold">Sign in to WC Bracket Challenge</h1>
          <p className="text-muted text-sm mt-1">Enter your email to receive a magic link</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent-dim active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </div>
  )
}
