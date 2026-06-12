import { createClient } from '@/lib/supabase/server'
import type { Match } from '@/lib/types'
import { ScheduleClient } from './ScheduleClient'

export const revalidate = 60

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .order('match_date')
    .order('match_time')

  const allMatches = (matches || []) as Match[]

  return <ScheduleClient matches={allMatches} />
}
