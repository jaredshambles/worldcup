import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'

// FIFA World Cup 2026 competition ID on football-data.org
const COMPETITION_ID = 738

// Map football-data.org team names to our DB team names where they differ
const TEAM_NAME_MAP: Record<string, string> = {
  'Korea Republic': 'Korea Republic',
  'South Korea': 'Korea Republic',
  'Republic of Korea': 'Korea Republic',
  'USA': 'United States',
  'United States of America': 'United States',
  'Czechia': 'Czech Republic',
  'Czech Republic': 'Czech Republic',
  'IR Iran': 'Iran',
  'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  'Trinidad and Tobago': 'Trinidad & Tobago',
  'Congo DR': 'DR Congo',
  'DR Congo': 'DR Congo',
  'Côte d\'Ivoire': 'Ivory Coast',
  "Cote d'Ivoire": 'Ivory Coast',
}

function normalizeTeamName(name: string): string {
  return TEAM_NAME_MAP[name] ?? name
}

function mapStatus(apiStatus: string): string {
  if (apiStatus === 'TIMED' || apiStatus === 'SCHEDULED') return 'scheduled'
  if (apiStatus === 'IN_PLAY' || apiStatus === 'HALFTIME' || apiStatus === 'PAUSED') return 'live'
  if (apiStatus === 'FINISHED' || apiStatus === 'AWARDED') return 'finished'
  return 'scheduled'
}

async function syncScores(dateFrom: string, dateTo: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const footballDataKey = Deno.env.get('FOOTBALL_DATA_API_KEY')

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  if (!footballDataKey) {
    throw new Error('Missing FOOTBALL_DATA_API_KEY — add it as a Supabase secret')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const apiUrl = `https://api.football-data.org/v4/competitions/${COMPETITION_ID}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`
  const apiResponse = await fetch(apiUrl, {
    headers: { 'X-Auth-Token': footballDataKey },
  })

  if (!apiResponse.ok) {
    const body = await apiResponse.text()
    throw new Error(`Football Data API error: ${apiResponse.status} — ${body}`)
  }

  const apiData = await apiResponse.json()
  const apiMatches = apiData.matches ?? []

  if (apiMatches.length === 0) {
    return { success: true, message: 'No matches found for date range', updated: 0, skipped: 0 }
  }

  const { data: dbMatches, error: dbError } = await supabase
    .from('matches')
    .select('id, home_team, away_team, api_match_id, status')

  if (dbError) throw new Error(`DB query error: ${dbError.message}`)

  let updated = 0
  let skipped = 0

  for (const apiMatch of apiMatches) {
    const apiHome = normalizeTeamName(apiMatch.homeTeam.name)
    const apiAway = normalizeTeamName(apiMatch.awayTeam.name)

    // Match by api_match_id first, fall back to team names
    let dbMatch = dbMatches?.find(m => m.api_match_id === String(apiMatch.id))
    if (!dbMatch) {
      dbMatch = dbMatches?.find(
        m => m.home_team === apiHome && m.away_team === apiAway
      )
    }

    if (!dbMatch) {
      console.log(`No DB match found for: ${apiHome} vs ${apiAway}`)
      skipped++
      continue
    }

    const status = mapStatus(apiMatch.status)
    const homeScore = apiMatch.score.fullTime.home
    const awayScore = apiMatch.score.fullTime.away

    const patch: Record<string, unknown> = {
      status,
      api_match_id: String(apiMatch.id),
    }

    if (homeScore !== null && awayScore !== null) {
      patch.home_score = homeScore
      patch.away_score = awayScore
    }

    const { error: updateError } = await supabase
      .from('matches')
      .update(patch)
      .eq('id', dbMatch.id)

    if (updateError) {
      console.error(`Error updating ${apiHome} vs ${apiAway}: ${updateError.message}`)
    } else {
      updated++
      const scoreStr = homeScore !== null ? `${homeScore}-${awayScore}` : 'in progress'
      console.log(`Updated: ${apiHome} ${scoreStr} ${apiAway} [${status}]`)
    }
  }

  return {
    success: true,
    message: `Processed ${apiMatches.length} API matches`,
    updated,
    skipped,
  }
}

Deno.serve(async (req: Request) => {
  // Support both GET and POST so it can be triggered manually from a browser
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Default: fetch yesterday + today to catch any late-finishing matches
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const dateTo = today.toISOString().split('T')[0]
    const dateFrom = yesterday.toISOString().split('T')[0]

    const result = await syncScores(dateFrom, dateTo)
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Sync failed:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
