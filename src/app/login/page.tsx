'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp, forgetPassword } from '@/lib/auth-client'

type AuthMode = 'login' | 'register' | 'forgot'

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: authError } = await signIn.email({
        email,
        password,
      })

      if (authError) {
        setError(authError.message || 'Failed to sign in. Please check your email and password.')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

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

    try {
      const { error: authError } = await signUp.email({
        email,
        password,
        name: fullName,
        callbackURL: '/dashboard',
      })

      if (authError) {
        setError(authError.message || 'Failed to register. Please try again.')
      } else {
        setError('')
        setSuccess('Account created! You can now sign in.')
        setMode('login')
        setPassword('')
        setConfirmPassword('')
        setFullName('')
        setNickname('')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: authError } = await forgetPassword({
        email,
        redirectTo: '/reset-password',
      })

      if (authError) {
        setError(authError.message || 'Failed to send reset link.')
      } else {
        setSuccess('If an account exists with that email, a reset link has been sent.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    }
    setLoading(false)
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setError('')
    setSuccess('')
  }

  const subtitle = {
    login: 'Sign in to your account',
    register: 'Create a new account',
    forgot: 'Reset your password',
  }[mode]

  const handleSubmit = {
    login: handleLogin,
    register: handleRegister,
    forgot: handleForgotPassword,
  }[mode]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-card rounded-lg border border-border p-6 sm:p-8 text-center">
          <div className="text-4xl mb-2">⚽</div>
          <h1 className="text-xl sm:text-2xl font-bold">WC Bracket Challenge</h1>
          <p className="text-muted text-sm mt-2">{subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-lg border border-border p-6 sm:p-8 space-y-4"
        >
          {mode === 'register' && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
              />
              <input
                type="text"
                placeholder="Nickname (optional)"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
          />

          {mode !== 'forgot' && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
            />
          )}

          {mode === 'register' && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2"
            />
          )}

          {success && <p className="text-green-500 text-sm">{success}</p>}
          {error && <p className="text-danger text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-primary text-white font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === 'login' ? 'Signing in...' : mode === 'register' ? 'Creating account...' : 'Sending...'
              : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
          </button>

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => switchMode('forgot')}
              className="w-full text-sm text-muted hover:text-accent"
            >
              Forgot password?
            </button>
          )}
        </form>

        <div className="text-center">
          <p className="text-muted text-sm">
            {mode === 'register' ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => switchMode(mode === 'register' ? 'login' : mode === 'login' ? 'register' : 'login')}
              className="text-accent hover:underline font-semibold"
            >
              {mode === 'register' ? 'Sign in' : mode === 'login' ? 'Register' : 'Back to sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
