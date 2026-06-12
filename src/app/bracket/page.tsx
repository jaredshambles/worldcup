import { createClient } from '@/lib/supabase/server'
import type { Match } from '@/lib/types'
import { BracketView } from './BracketView'

export const revalidate = 60

export default async function BracketPage() {
  const supabase = await createClient()

  const [{ data: matches }, { data: groupMatches }] = await Promise.all([
    supabase.from('matches').select('*').order('match_number'),
    supabase.from('matches').select('*').eq('stage', 'group').order('match_number'),
  ])

  // Build group standings from finished group matches
  const standings: Record<string, { team: string; pts: number; gd: number; gf: number }[]> = {}
  for (const m of (groupMatches || []) as Match[]) {
    if (m.status !== 'finished' || !m.group_letter) continue
    const g = m.group_letter
    if (!standings[g]) standings[g] = []

    const findOrCreate = (team: string) => {
      let entry = standings[g].find(e => e.team === team)
      if (!entry) { entry = { team, pts: 0, gd: 0, gf: 0 }; standings[g].push(entry) }
      return entry
    }

    const home = findOrCreate(m.home_team)
    const away = findOrCreate(m.away_team)
    const hs = m.home_score!, as = m.away_score!

    home.gf += hs; home.gd += hs - as
    away.gf += as; away.gd += as - hs

    if (hs > as) { home.pts += 3 }
    else if (hs < as) { away.pts += 3 }
    else { home.pts += 1; away.pts += 1 }
  }

  // Sort each group
  for (const g of Object.keys(standings)) {
    standings[g].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
  }

  return (
    <BracketView
      knockoutMatches={(matches || []) as Match[]}
      groupStandings={standings}
    />
  )

// Note: knockoutMatches includes ALL matches (both group and knockout) to support filtering in BracketView
}
