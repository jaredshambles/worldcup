'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

const publicLinks = [
  { href: '/', label: 'Leaderboard' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/bracket', label: 'Bracket' },
  { href: '/news', label: 'News' },
  { href: '/chat', label: 'Chat' },
]

const authLinks = [
  { href: '/dashboard', label: 'My Dashboard' },
  { href: '/predictions', label: 'Predictions' },
  { href: '/head-to-head', label: 'H2H' },
]

export function Nav() {
  const pathname = usePathname()
  const [user, setUser] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        if (data) setUser(data as Profile)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
      } else if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (data) setUser(data as Profile)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const allLinks = user ? [...publicLinks, ...authLinks] : publicLinks
  if (user?.is_admin) allLinks.push({ href: '/admin', label: 'Admin' })

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="WC 2026 Home">
            <span className="text-xl" aria-hidden="true">&#9917;</span>
            <span className="font-bold text-accent-primary hidden sm:inline">WC 2026</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {allLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  pathname === link.href
                    ? 'bg-accent-primary text-white font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary hidden sm:inline">
                  {user.nickname || user.full_name}
                </span>
                <button
                  onClick={handleSignOut}
                  aria-label="Sign out from your account"
                  className="text-xs px-2 py-1 rounded bg-surface-hover text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 rounded bg-accent-primary text-white font-semibold hover:bg-danger transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="mobile-menu" className="md:hidden pb-3 border-t border-border">
            {allLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 text-sm rounded transition-colors ${
                  pathname === link.href
                    ? 'bg-accent-primary text-white font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
