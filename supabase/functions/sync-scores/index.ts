import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'

interface Match {
  id: string
  utcDate: string
  status: string
  homeTeam: { name: string }
  awayTeam: { name: string }
  score: {
    fullTime: { home: number | null; away: number | null }
  }
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const footballDataKey = Deno.env.get('FOOTBALL_DATA_API_KEY')

if (!supabaseUrl || !supabaseKey || !footballDataKey) {
  throw new Error('Missing required environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// FIFA World Cup 2026 competition ID in football-data.org
const COMPETITION_ID = 738

async function syncScores() {
  try {
    // Fetch today's matches from football-data.org
    const today = new Date().toISOString().split('T')[0]
    const apiUrl = `https://api.football-data.org/v4/competitions/${COMPETITION_ID}/matches?dateFrom=${today}&dateTo=${today}`

    const apiResponse = await fetch(apiUrl, {
      headers: { 'X-Auth-Token': footballDataKey },
    })

    if (!apiResponse.ok) {
      throw new Error(`Football Data API error: ${apiResponse.status} ${apiResponse.statusText}`)
    }

    const apiData = await apiResponse.json()
    const apiMatches = apiData.matches || []

    // Get all our matches from the database
    const { data: dbMatches, error: dbError } = await supabase
      .from('matches')
      .select('id, home_team, away_team, api_match_id, status')

    if (dbError) {
      throw new Error(`Database query error: ${dbError.message}`)
    }

    let updatedCount = 0

    // For each API match, find and update the corresponding DB match
    for (const apiMatch of apiMatches) {
      // Try to find match by api_match_id first
      let dbMatch = dbMatches?.find(m => m.api_match_id === apiMatch.id.toString())

      // Fallback to team name matching
      if (!dbMatch) {
        dbMatch = dbMatches?.find(
          m =>
            (m.home_team === apiMatch.homeTeam.name || m.away_team === apiMatch.awayTeam.name) &&
            (m.home_team === apiMatch.homeTeam.name &&
              m.away_team === apiMatch.awayTeam.name)
        )
      }

      if (!dbMatch) {
        console.log(
          `No match found for ${apiMatch.homeTeam.name} vs ${apiMatch.awayTeam.name}`
        )
        continue
      }

      // Map API status to our status format
      let status = apiMatch.status
      if (status === 'TIMED') status = 'scheduled'
      if (status === 'IN_PLAY') status = 'live'
      if (status === 'FINISHED' || status === 'PAUSED') status = 'finished'

      // Only update if scores are available
      const homeScore = apiMatch.score.fullTime.home
      const awayScore = apiMatch.score.fullTime.away

      if (homeScore !== null && awayScore !== null) {
        const { error: updateError } = await supabase
          .from('matches')
          .update({
            home_score: homeScore,
            away_score: awayScore,
            status: status,
            api_match_id: apiMatch.id.toString(),
          })
          .eq('id', dbMatch.id)

        if (updateError) {
          console.error(`Error updating match ${dbMatch.id}: ${updateError.message}`)
        } else {
          updatedCount++
          console.log(
            `Updated ${apiMatch.homeTeam.name} ${homeScore}-${awayScore} ${apiMatch.awayTeam.name}`
          )
        }
      } else {
        // Update status and api_match_id even if scores aren't final yet
        await supabase
          .from('matches')
          .update({
            status: status,
            api_match_id: apiMatch.id.toString(),
          })
          .eq('id', dbMatch.id)
          .then(() => {
            updatedCount++
          })
      }
    }

    return {
      success: true,
      message: `Synced ${updatedCount} matches`,
      matchesProcessed: apiMatches.length,
    }
  } catch (error) {
    console.error('Sync error:', error)
    throw error
  }
}

// Main handler
Deno.serve(async (req: Request) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const result = await syncScores()
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
