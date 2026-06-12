import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function lockDeadlines() {
  try {
    // Get all deadlines that have passed
    const now = new Date().toISOString()
    const { data: passedDeadlines, error: deadlineError } = await supabase
      .from('deadlines')
      .select('id, stage, deadline_utc')
      .lt('deadline_utc', now)

    if (deadlineError) {
      throw new Error(`Failed to fetch deadlines: ${deadlineError.message}`)
    }

    if (!passedDeadlines || passedDeadlines.length === 0) {
      return {
        success: true,
        message: 'No deadlines to process',
        lockedCount: 0,
      }
    }

    let lockedCount = 0

    // For each passed deadline, lock predictions for that stage
    for (const deadline of passedDeadlines) {
      try {
        // Call the lock_predictions_for_stage function
        const { error: lockError } = await supabase.rpc('lock_predictions_for_stage', {
          stage_name: deadline.stage,
        })

        if (lockError) {
          console.error(`Error locking stage ${deadline.stage}: ${lockError.message}`)
          continue
        }

        lockedCount++
        console.log(`Locked predictions for stage: ${deadline.stage}`)
      } catch (error) {
        console.error(`Error processing deadline ${deadline.id}:`, error)
      }
    }

    return {
      success: true,
      message: `Locked ${lockedCount} stages`,
      processedCount: passedDeadlines.length,
    }
  } catch (error) {
    console.error('Lock deadline error:', error)
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
    const result = await lockDeadlines()
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
